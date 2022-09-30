import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";
import { withRouter, useHistory, RouteComponentProps } from "react-router-dom";
//import loginFormValidator from '../services/loginFormValidator';
//import signUpFormValidator from '../services/signUpFormValidator';

import "../styles/pages/login.css";
import { useAuth } from "../contexts/auths";

import MainCard from "../components/MainCard";
import { stringify } from "querystring";

const Login: React.FC<RouteComponentProps> = () => {
  const { signed, signIn } = useAuth();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password_hash, setPasswordHash] = useState("");
  const [login, setLogin] = useState(true);

  function renderPageCadastro() {
    if (!login) return "flex";
    return "none";
  }

  function renderPageLogin() {
    if (login) return "flex";
    return "none";
  }

  async function handleSignUpSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("users", { name, email, password_hash });
      toast.success("Cadastro realizado com sucesso. Faça o login.");
      history.push("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);

        if (error.response.data.errors.name) {
          toast.error("O campo NOME é obrigatório");
        }
        if (error.response.data.errors.email) {
          toast.error("Por favor, utilize um EMAIL VÁLIDO");
        }
        if (error.response.data.errors.password_hash) {
          toast.error("O campo SENHA deve conter pelo menos 6 dígitos");
        }
      }
    }
  }

  async function handleLoginSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await signIn(email, password_hash);
      history.push("/map");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }
  }

  return (
    <>
      <div className="containerLogin" style={{ display: renderPageLogin() }}>
        <MainCard />
        <div className="loginCard">
          <form id="form1" onSubmit={handleLoginSubmit}>
            <h1>Fazer login</h1>
            <label htmlFor="email">Email</label>
            <input
              id="emailLogin"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password">Senha</label>
            <input
              id="passwordLogin"
              type="password"
              value={password_hash}
              onChange={(event) => setPasswordHash(event.target.value)}
            />
            <span onClick={() => setLogin(!login)}>Criar conta gratuita</span>
            <button className="confirm-button" type="submit">
              Entrar
            </button>
          </form>
        </div>
      </div>

      <div
        className="containerCadastro"
        style={{ display: renderPageCadastro() }}
      >
        <MainCard />
        <div className="cadastroCard">
          <form id="form2" onSubmit={handleSignUpSubmit}>
            <h1>Criar conta</h1>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password_hash">Senha</label>
            <input
              id="password_hash"
              type="password"
              value={password_hash}
              onChange={(event) => setPasswordHash(event.target.value)}
            />
            <span onClick={() => setLogin(!login)}>Já tenho conta</span>
            <button className="create-button" type="submit">
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default withRouter(Login);
