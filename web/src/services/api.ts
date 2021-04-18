import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:3333",
  baseURL: "https://happy-backend-2021.herokuapp.com/",
});

export default api;
