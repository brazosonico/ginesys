import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Manda el token de sesion (Sanctum) en cada request.
// Leemos localStorage directamente aqui (en vez de importar utils/auth)
// para evitar un import circular, ya que auth.js usa este mismo cliente
// "api" para llamar a /logout.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("tipo_usuario");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;