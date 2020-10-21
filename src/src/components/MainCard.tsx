import React from 'react';

import mapMarkerImg from '../images/map-marker.svg';
import nameLogo from '../images/nameLogo.svg';

import '../styles/components/MainCard.css';

const MainCard: React.FC = () => {
  return (
    <div className="container">
        <img className="logo01" src={mapMarkerImg} alt="Happy" />
        <img className="textLogo" src={nameLogo} alt="Happy01" />

        <h3>Nova Friburgo</h3>
        <span>Rio de Janeiro</span>
    </div>

  );
}

export default MainCard;