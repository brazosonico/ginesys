import api from "./api";

export async function getDoctorDashboard() {
  // GET /api/doctor/dashboard
  // Backend filtra por el doctor del X-Usuario-Id
  const response = await api.get("/doctor/dashboard");
  return response.data;
}

export async function getDoctorAppointments(filters = {}) {
  // GET /api/doctor/appointments?date=&status=&search=
  const response = await api.get("/doctor/appointments", { params: filters });
  return response.data;
}

export async function getClinicalRecord(patientId) {
  // GET /api/patients/{patientId}/clinical-record
  const response = await api.get(`/patients/${patientId}/clinical-record`);
  return response.data;
}

export async function getMisPacientes(search = "") {
  // GET /api/doctor/pacientes?search=
  const response = await api.get("/doctor/pacientes", { params: { search } });
  return response.data;
}

export async function getPerfilDoctor() {
  // GET /api/doctor/perfil
  const response = await api.get("/doctor/perfil");
  return response.data;
}

export async function updatePerfilDoctor(data) {
  // PUT /api/doctor/perfil
  const response = await api.put("/doctor/perfil", data);
  return response.data;
}

export async function getEspecialidades() {
  // GET /api/especialidades
  const response = await api.get("/especialidades");
  return response.data;
}

export async function crearCitaComoDoctor(data) {
  // POST /api/doctor/citas
  const response = await api.post("/doctor/citas", data);
  return response.data;
}

export async function actualizarEstadoCita(idCita, estado) {
  // PATCH /api/doctor/citas/{id}/estado
  // Body: { estado } — uno de: programada, confirmada, en_curso, completada, cancelada, no_asistio
  const response = await api.patch(`/doctor/citas/${idCita}/estado`, { estado });
  return response.data;
}

export async function crearReceta(data) {
  // POST /api/doctor/citas/{citaId}/receta
  // Body: { patientId, diagnostico, medicamentos: [{ nombre, dosis, frecuencia, duracion, indicaciones }] }
  const { citaId, ...body } = data;
  const response = await api.post(`/doctor/citas/${citaId}/receta`, body);
  return response.data;
}