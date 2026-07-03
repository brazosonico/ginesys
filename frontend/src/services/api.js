import axios from "axios";
import { getUsuario } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Manda el id_usuario logueado en cada request.
// AQUÍ CONECTA AL BACK BRAY: mientras no haya Sanctum/JWT,
// el backend debe leer este header para saber quién hace la petición.
api.interceptors.request.use((config) => {
  const usuario = getUsuario();
  if (usuario?.id_usuario) {
    config.headers["X-Usuario-Id"] = usuario.id_usuario;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("tipo_usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;