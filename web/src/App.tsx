import React from 'react';
import  GlobalStyle from  '../src/styles/global';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import  './styles/global.ts';
import { AuthProvider } from '../src/contexts/auths';

import Routes from '../src/routes';
import history from './services/history';

function App() {
  return (
    <AuthProvider>
      <Router history={history}>
        <GlobalStyle />
        <Routes />
        <ToastContainer autoClose={3000}/>
      </Router>
    </AuthProvider>
  );
}

export default App;
