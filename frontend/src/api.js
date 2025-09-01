import axios from "axios";


const API = axios.create({
   baseURL: "http://localhost:8000/api/tasks", //Django backend URL
});

export default API;