import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getDoctorDashboard() {
  // AQUÍ CONECTA AL BACK BRAY:
  // Endpoint sugerido: GET /api/doctor/dashboard
  // Debe regresar: doctor, stats, nextAppointments, recentPatients
  const response = await api.get("/doctor/dashboard");
  return response.data;
}

export async function getDoctorAppointments(filters = {}) {
  // AQUÍ CONECTA AL BACK BRAY:
  // Endpoint sugerido: GET /api/doctor/appointments
  // Puede recibir filtros: date, status, search
  const response = await api.get("/doctor/appointments", {
    params: filters,
  });
  return response.data;
}

export async function getClinicalRecord(patientId) {
  // AQUÍ CONECTA AL BACK BRAY:
  // Endpoint sugerido: GET /api/patients/{patientId}/clinical-record
  const response = await api.get(`/patients/${patientId}/clinical-record`);
  return response.data;
}
