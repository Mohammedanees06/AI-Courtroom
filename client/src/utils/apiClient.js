import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Handle global errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
