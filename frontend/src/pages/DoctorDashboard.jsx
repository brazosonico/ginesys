import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorDashboard, actualizarEstadoCita } from "../services/doctorService";
import "../styles/doctorPages.css";

const initialDashboard = {
  doctor: null,
  stats: {
    todayAppointments: 0,
    pendingPatients: 0,
    completedConsultations: 0,
  },
  nextAppointments: [],
  recentPatients: [],
};

function DoctorDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");
  const [actualizando, setActualizando] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDoctorDashboard();
      setDashboard({
        doctor: data.doctor || null,
        stats: data.stats || initialDashboard.stats,
        nextAppointments: data.nextAppointments || [],
        recentPatients: data.recentPatients || [],
      });
    } catch (error) {
      setBackendMessage(
        "AQUÍ CONECTA AL BACK BRAY: falta conectar el endpoint del dashboard médico."
      );
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(idCita, nuevoEstado) {
    setActualizando(idCita);
    try {
      await actualizarEstadoCita(idCita, nuevoEstado);
      await loadDashboard();
    } catch {
      setBackendMessage("No se pudo actualizar el estado de la cita.");
    } finally {
      setActualizando(null);
    }
  }

  // Marca la cita como "en_curso" y manda al doctor a la pantalla de receta
  async function iniciarConsulta(appointment) {
    setActualizando(appointment.id);
    try {
      await actualizarEstadoCita(appointment.id, "en_curso");
      navigate(`/doctor/citas/${appointment.id}/receta`, {
        state: {
          citaId: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
        },
      });
    } catch {
      setBackendMessage("No se pudo iniciar la consulta.");
      setActualizando(null);
    }
  }

  function renderAcciones(appointment) {
    const estado = appointment.status;
    const enProceso = actualizando === appointment.id;

    if (estado === "programada") {
      return (
        <div className="doctor-list-item-actions">
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => cambiarEstado(appointment.id, "confirmada")}
          >
            Confirmar
          </button>
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => cambiarEstado(appointment.id, "cancelada")}
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (estado === "confirmada") {
      return (
        <div className="doctor-list-item-actions">
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => iniciarConsulta(appointment)}
          >
            Iniciar consulta
          </button>
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => cambiarEstado(appointment.id, "no_asistio")}
          >
            No asistió
          </button>
        </div>
      );
    }

    if (estado === "en_curso") {
      return (
        <div className="doctor-list-item-actions">
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => navigate(`/doctor/citas/${appointment.id}/receta`, {
              state: {
                citaId: appointment.id,
                patientId: appointment.patientId,
                patientName: appointment.patientName,
              },
            })}
          >
            Continuar receta
          </button>
          <button
            className="doctor-button secondary"
            disabled={enProceso}
            onClick={() => cambiarEstado(appointment.id, "completada")}
          >
            Finalizar
          </button>
        </div>
      );
    }

    return null;
  }

  return (
    <section className="doctor-page">
      <header className="doctor-page-header">
        <div>
          <h1>Dashboard médico</h1>
          <p>Resumen general de consultas, pacientes y citas asignadas al médico.</p>
        </div>
      </header>

      {backendMessage && <div className="doctor-empty">{backendMessage}</div>}

      <div className="doctor-grid stats">
        <article className="stat-card">
          <span>Citas de hoy</span>
          <strong>{dashboard.stats.todayAppointments}</strong>
        </article>

        <article className="stat-card">
          <span>Pacientes pendientes</span>
          <strong>{dashboard.stats.pendingPatients}</strong>
        </article>

        <article className="stat-card">
          <span>Consultas finalizadas</span>
          <strong>{dashboard.stats.completedConsultations}</strong>
        </article>
      </div>

      <div className="doctor-grid two-columns">
        <article className="doctor-card">
          <h2>Próximas citas</h2>

          {loading ? (
            <div className="doctor-empty">Cargando citas...</div>
          ) : dashboard.nextAppointments.length === 0 ? (
            <div className="doctor-empty">No hay citas para mostrar.</div>
          ) : (
            <div className="doctor-list">
              {dashboard.nextAppointments.map((appointment) => (
                <div className="doctor-list-item stacked" key={appointment.id}>
                  <div>
                    <h4>{appointment.patientName}</h4>
                    <p>{appointment.reason}</p>
                    <p>
                      {appointment.date} · {appointment.time}
                    </p>
                  </div>

                  <div>
                    <span className={`status-pill ${appointment.status || "programada"}`}>
                      {appointment.statusLabel || "Programada"}
                    </span>
                    {renderAcciones(appointment)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="doctor-card">
          <h2>Pacientes recientes</h2>

          {loading ? (
            <div className="doctor-empty">Cargando pacientes...</div>
          ) : dashboard.recentPatients.length === 0 ? (
            <div className="doctor-empty">No hay pacientes recientes.</div>
          ) : (
            <div className="doctor-list">
              {dashboard.recentPatients.map((patient) => (
                <div className="doctor-list-item" key={patient.id}>
                  <div>
                    <h4>{patient.fullName}</h4>
                    <p>{patient.lastVisit}</p>
                  </div>

                  <a className="doctor-button secondary" href={`/doctor/expediente/${patient.id}`}>
                    Ver expediente
                  </a>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default DoctorDashboard;