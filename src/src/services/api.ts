import axios from 'axios';

const api = axios.create({
 // baseURL: 'https://happy-backend-2020.herokuapp.com/'
 baseURL: 'http://localhost:3333/'
 /* transformRequest: [function (data, headers) {
  // Do whatever you want to transform the data
  const storagedToken = window.localStorage.getItem('@Happy:token');
  if (storagedToken) {
    headers.Authorization = `Bearer ${storagedToken}`;
  }
  return data;
}], */
});

export default api;