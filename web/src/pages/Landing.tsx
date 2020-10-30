import React from 'react';
import logoImg from '../images/logo.svg';

import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import {useAuth} from '../contexts/auths';

import '../styles/pages/landing.css';


const Landing: React.FC = () => {
  const { signed }= useAuth();
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={logoImg} alt="Happy" />

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>

        <div className="location">
          <strong>Nova Friburgo</strong>
          <span>Rio de Janeiro</span>
        </div>
        
        { signed? <Link to="/map" className="enter-app">
          <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
        </Link> : <Link to="/login" className="enter-app">
          <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
        </Link>}
        
      </div>
    </div>
  );
};

export default Landing;