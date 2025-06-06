// src/utils/api.js
import axios from "axios";

// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://task-manager-production-1bb3.up.railway.app";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
