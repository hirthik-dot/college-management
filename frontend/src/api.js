import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_Backend_url}/api`,
});

export default API;
