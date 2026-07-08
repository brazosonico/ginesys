import api from "../services/api";

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

export function getTipoUsuario() {
  return localStorage.getItem("tipo_usuario");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isDoctor() {
  const usuario = getUsuario();
  return usuario?.id_rol === 2;
}

// Intenta avisarle al backend que revoque el token antes de borrar todo
// localmente. Si la llamada falla (sin internet, token ya vencido, etc.)
// igual se cierra la sesion en el navegador.
export async function logout() {
  try {
    await api.post("/logout");
  } catch {
    // Ignoramos el error: de cualquier forma vamos a limpiar localStorage.
  } finally {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo_usuario");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}