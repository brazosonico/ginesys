import api from "./api";

export async function getMisCitas(idUsuario, tipoUsuario) {
  const response = await api.get("/citas", {
    params: { id_usuario: idUsuario, tipo_usuario: tipoUsuario },
  });
  return response.data;
}

export async function actualizarCita(idCita, data) {
  const response = await api.put(`/citas/${idCita}`, data);
  return response.data;
}

export async function cancelarCita(idCita) {
  const response = await api.patch(`/citas/${idCita}/cancelar`);
  return response.data;
}

export async function getRecetaPorCita(idCita, idUsuario) {
  const response = await api.get(`/citas/${idCita}/receta`, {
    params: { id_usuario: idUsuario },
  });
  return response.data;
}