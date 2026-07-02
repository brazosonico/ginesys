import React, { useEffect, useState } from "react";
import { getDoctorAppointments } from "../services/doctorService";
import "../styles/doctorPages.css";

function AppointmentsAgenda() {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments(customFilters = filters) {
    setLoading(true);

    try {
      const data = await getDoctorAppointments(customFilters);
      setAppointments(data.appointments || []);
      setBackendMessage("");
    } catch (error) {
      setAppointments([]);
      setBackendMessage(
        "AQUÍ CONECTA AL BACK BRAY: falta conectar el endpoint de agenda de citas."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  function handleSearch(event) {
    event.preventDefault();
    loadAppointments(filters);
  }

  function handleAppointmentAction(appointmentId, action) {
    // AQUÍ CONECTA AL BACK BRAY:
    // Acciones sugeridas:
    // PATCH /api/doctor/appointments/{appointmentId}/status
    // action puede ser: confirmed, cancelled, completed
    console.log("Pendiente conectar acción:", appointmentId, action);
  }

  return (
    <section className="doctor-page">

      <header className="doctor-page-header">
        <div>
          <h1>Agenda de citas</h1>
          <p>
            Consulta, filtra y gestiona las citas asignadas al médico.
          </p>
        </div>
      </header>

      <article className="doctor-card">
        <form className="doctor-filters" onSubmit={handleSearch}>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="completed">Finalizadas</option>
          </select>

          <input
            type="text"
            name="search"
            placeholder="Buscar paciente..."
            value={filters.search}
            onChange={handleFilterChange}
          />

          <button className="doctor-button" type="submit">
            Buscar
          </button>
        </form>

        {backendMessage && (
          <div className="doctor-empty">
            {backendMessage}
          </div>
        )}

        {loading ? (
          <div className="doctor-empty">Cargando agenda...</div>
        ) : appointments.length === 0 ? (
          <div className="doctor-empty">
            No hay citas registradas con estos filtros.
          </div>
        ) : (
          <div className="doctor-list">
            {appointments.map((appointment) => (
              <div className="doctor-list-item" key={appointment.id}>
                <div>
                  <h4>{appointment.patientName}</h4>
                  <p>{appointment.reason}</p>
                  <p>{appointment.date} · {appointment.time}</p>
                </div>

                <div>
                  <span className={`status-pill ${appointment.status || "pending"}`}>
                    {appointment.statusLabel || "Pendiente"}
                  </span>

                  <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                    <button
                      className="doctor-button secondary"
                      type="button"
                      onClick={() =>
                        handleAppointmentAction(appointment.id, "confirmed")
                      }
                    >
                      Confirmar
                    </button>

                    <button
                      className="doctor-button secondary"
                      type="button"
                      onClick={() =>
                        handleAppointmentAction(appointment.id, "completed")
                      }
                    >
                      Finalizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

export default AppointmentsAgenda;
