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
  
  export function isDoctor() {
    const usuario = getUsuario();
    return usuario?.id_rol === 2;
  }
  
  export function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo_usuario");
    window.location.href = "/login";
  }