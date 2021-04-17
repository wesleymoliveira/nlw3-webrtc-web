import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auths";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import io from "socket.io-client";
import Peer from "simple-peer";
import { FiPlus, FiArrowRight } from "react-icons/fi";

import { Howl } from "howler";

import LogoHappy from "../components/LogoHappy";

import camera from "../images/Icons/camera.svg";
import camerastop from "../images/Icons/camera-stop.svg";
import microphone from "../images/Icons/microphone.svg";
import microphonestop from "../images/Icons/microphone-stop.svg";
import hangup from "../images/Icons/hang-up.svg";
import ringtone from "../utils/Sounds/ringtone.mp3";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import mapMarkerImg from "../images/map-marker.svg";

import "../styles/pages/orphanages-map.css";
import happyMapIcon from "../utils/mapicon";
import api from "../services/api";

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true,
});

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const { user, signOut } = useAuth();

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [receiverID, setReceiverID] = useState("");
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<any>();
  const myPeer = useRef<Peer.Instance>();

  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get("orphanages").then((response) => {
      setOrphanages(response.data);
    });
  }, []);

  useEffect(() => {
    socket.current = io.connect("/");

    socket.current.on("yourID", (id: string) => {
      //console.log(`O id e ${id}`);
      setYourID(id);
    });
    socket.current.on("allUsers", (users: string) => {
      setUsers(users);
    });

    socket.current.on("hey", (data: any) => {
      setReceivingCall(true);
      ringtoneSound.play();
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id: any) {
    if (id !== "" && users[id] && id !== yourID) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          setCallingFriend(true);
          setCaller(id);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
          const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
              iceServers: [
                {
                  urls: "stun:numb.viagenie.ca",
                  username: "wesleyoliveirarj@hotmail.com",
                  credential: "123456",
                },
                {
                  urls: "turn:numb.viagenie.ca",
                  username: "wesleyoliveirarj@hotmail.com",
                  credential: "123456",
                },
              ],
            },
            stream: stream,
          });

          myPeer.current = peer;

          peer.on("signal", (data) => {
            socket.current.emit("callUser", {
              userToCall: id,
              signalData: data,
              from: yourID,
            });
          });

          peer.on("stream", (stream: MediaStream) => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = stream;
            }
          });

          peer.on("error", (err) => {
            endCall();
          });

          socket.current.on("callAccepted", (signal: string) => {
            setCallAccepted(true);
            peer.signal(signal);
          });

          socket.current.on("close", () => {
            window.location.reload();
          });

          socket.current.on("rejected", () => {
            window.location.reload();
          });
        })
        .catch(() => {
          toast.error(
            "Por favor, verifique se possui (Câmera, Microfone). Certifique-se de dar as devidas permissões de acesso para o navegador."
          );
        });
    } else {
      toast.error(
        "Opa, usuário não encontrado, tem certeza que digitou corretamente?"
      );

      return;
    }
  }

  function acceptCall() {
    ringtoneSound.unload();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", (data) => {
          socket.current.emit("acceptCall", { signal: data, to: caller });
        });

        peer.on("stream", (stream: MediaStream) => {
          if (partnerVideo.current !== null) {
            partnerVideo.current.srcObject = stream;
          }
        });

        peer.on("error", (err) => {
          endCall();
        });

        peer.signal(callerSignal);

        socket.current.on("close", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        toast.error(
          "Por favor, verifique se possui (Câmera, Microfone). Certifique-se de dar as devidas permissões de acesso para o navegador."
        );
      });
  }

  function rejectCall() {
    ringtoneSound.unload();
    setCallRejected(true);
    socket.current.emit("rejected", { to: caller });
    window.location.reload();
  }

  function endCall() {
    if (myPeer.current !== null && myPeer.current !== undefined) {
      myPeer.current.destroy();
      socket.current.emit("close", { to: caller });
      window.location.reload();
    }
  }

  function handleClickMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted);
      stream.getAudioTracks()[0].enabled = audioMuted;
    }
  }
  function handleSignout() {
    signOut();
  }

  function handleClickMuteVideo() {
    if (stream) {
      setVideoMuted(!videoMuted);
      stream.getVideoTracks()[0].enabled = videoMuted;
    }
  }

  function renderMap() {
    if (!callRejected && !callAccepted && !callingFriend) return "flex";
    return "none";
  }

  function renderCall() {
    if (!callRejected && !callAccepted && !callingFriend) return "none";
    return "block";
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall">
          <div className="incomingMessageContainer">
            <span className="message"> Compartilhe sua experência com </span>
            <span className="message">{caller} </span>
          </div>
          <div className="incomingCallButtons">
            <button
              name="accept"
              className="buttonAccept"
              onClick={() => acceptCall()}
            >
              Aceitar
            </button>
            <button
              name="reject"
              className="buttonReject"
              onClick={() => rejectCall()}
            >
              Recusar
            </button>
          </div>
        </div>
      </div>
    );
  }

  let audioControl;
  if (audioMuted) {
    audioControl = (
      <span className="iconContainer" onClick={() => handleClickMuteAudio()}>
        <img src={microphonestop} alt="Unmute audio" />
      </span>
    );
  } else {
    audioControl = (
      <span className="iconContainer" onClick={() => handleClickMuteAudio()}>
        <img src={microphone} alt="Mute audio" />
      </span>
    );
  }
  let videoControl;
  if (videoMuted) {
    videoControl = (
      <span className="iconContainer" onClick={() => handleClickMuteVideo()}>
        <img src={camerastop} alt="Resume video" />
      </span>
    );
  } else {
    videoControl = (
      <span className="iconContainer" onClick={() => handleClickMuteVideo()}>
        <img src={camera} alt="Stop audio" />
      </span>
    );
  }

  let hangUp = (
    <span className="iconContainer" onClick={() => endCall()}>
      <img src={hangup} alt="End call" />
    </span>
  );

  return (
    <>
      <div id="page-map" style={{ display: renderMap() }}>
        <aside>
          <header>
            <>
              <img src={mapMarkerImg} alt="Happy" />
              <>
                <span>Olá, seja bem vindo </span>
                <span>{user ? user.name : "!"} :)</span>
              </>
              <button onClick={handleSignout}>Sair</button>
            </>
            <h2>Escolha um orfanato no mapa</h2>
            <p>Muitas crianças estão esperando a sua visita :)</p>
          </header>
          <footer>
            <h3>Compartilhe sua visita com um amigo.</h3>
            <div className="usernameActionText">
              Para quem deseja ligar,{" "}
              <span className="username highlight">{yourID}</span> ?
            </div>
            <input
              type="text"
              placeholder="ID do parceiro"
              value={receiverID}
              onChange={(e) => setReceiverID(e.target.value)}
            />
            <button onClick={() => callPeer(receiverID.toLowerCase().trim())}>
              Ligar
            </button>
          </footer>
        </aside>

        <MapContainer
          center={[-22.2810255, -42.5335925]}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          />

          {orphanages.map((orphanage) => {
            return (
              <Marker
                key={orphanage.id}
                icon={happyMapIcon}
                position={[orphanage.latitude, orphanage.longitude]}
              >
                <Popup
                  closeButton={false}
                  minWidth={240}
                  maxWidth={240}
                  className="map-popup"
                >
                  {orphanage.name}
                  <Link to={`orphanages/${orphanage.id}`}>
                    <FiArrowRight size={25} color="#FFF" />
                  </Link>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <Link to="/orphanages/create" className="create-orphanage">
          <FiPlus size={32} color="#FFF" />
        </Link>
      </div>

      <div>{incomingCall}</div>
      <div className="callContainer" style={{ display: renderCall() }}>
        <LogoHappy />
        <div className="partnerVideoContainer">{PartnerVideo}</div>
        <div className="userVideoContainer">{UserVideo}</div>
        <div className="controlsContainer">
          {audioControl}
          {videoControl}
          {hangUp}
        </div>
      </div>
    </>
  );
}

export default OrphanagesMap;
