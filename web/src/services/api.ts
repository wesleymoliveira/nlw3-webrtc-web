import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.1.105:3333',
 baseURL: 'https://happy-backend-2020.herokuapp.com/'
 
});

export default api;