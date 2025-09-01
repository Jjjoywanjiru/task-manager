import axios from "axios";

// Use env var in dev, and it's easy to swap for prod later
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8000/api/tasks",
  headers: { "Content-Type": "application/json" },
});

export default API;
