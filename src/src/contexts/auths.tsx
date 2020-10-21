import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AxiosResponse } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface ResponseSignInUser {
  token: string;
  user: User;
  error?: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  error: string | null;
  loading: boolean;
  signIn(
    email: string,
    password: string
  ): Promise<AxiosResponse<ResponseSignInUser>>;
  signOut(): void;
  }
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children}) => { 
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] =useState(true);

  useEffect(()=> {
    async function loadStorageData() {
     const storagedUser =  window.localStorage.getItem('@Happy:user');
     const storagedToken = window.localStorage.getItem('@Happy:token');
     
     if ( storagedUser && storagedToken) {
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
       setUser(JSON.parse(storagedUser));
      } 
    }
    loadStorageData();
    setLoading(false);
  }, []);

  async function  signIn(email: string, password: string):Promise<AxiosResponse<ResponseSignInUser>>{
    //const response = await auth.signIn(email, password);
    
    const response = await api.post<ResponseSignInUser>('/sessions', { email, password });
    
    if (response.data.error) { 
      setError(JSON.stringify(response.data.error));
    }

    if (response.data.user) { 
      setUser(response.data.user);
      //console.log(response.data.user)

      api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

      await window.localStorage.setItem('@Happy:user', JSON.stringify(response.data.user));
      await window.localStorage.setItem('@Happy:token', (response.data.token));
    }

     return response;
  }

  function signOut(){
    window.localStorage.clear();
    setUser(null);
  }

   if(loading) {
     return <h1>Carregando...</h1>
   }
 
  return (
  <AuthContext.Provider value={{ signed: !!user, user, error, loading, signIn, signOut }} >
    {children}
  </AuthContext.Provider>
  );
};

export function useAuth(){
  const context =useContext(AuthContext);
  return context;
}