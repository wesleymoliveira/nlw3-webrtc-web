import React from 'react';

import { Link } from 'react-router-dom';

import '../styles/pages/orphanageCreated.css';
import img from '../images/Image02.svg';

const OrphanageCreated: React.FC = () => {
  return (
    <div id="page-done">
      <div className="left">
          <h1>Ebaaa!</h1>
          <p>O cadastro deu certo e foi enviado</p>
          <p>ao administrador para ser aprovado</p>
          <p>Agora é só esperar :)</p>
        <Link to="/map">
          <button className="buttonOK"> Voltar para o mapa </button>
        </Link>
      </div>

      <div className="right">
        <img src={img} alt="Happy" />
      </div>
        
    </div>
  );
};

export default OrphanageCreated;