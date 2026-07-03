import React, { useEffect, useState } from "react";
import { getMisPacientes, crearCitaComoDoctor } from "../services/doctorService";
import "../styles/doctorPages.css";

function DoctorAgendarCita() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    id_paciente: "",
    fecha_hora: "",
    motivo_consulta: "",
    observaciones: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMisPacientes();
        setPacientes(data.pacientes || []);
      } catch {
        setError("No se pudo cargar la lista de pacientes.");
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensaje("");
    setError("");
    try {
      await crearCitaComoDoctor(form);
      setMensaje("Cita agendada correctamente.");
      setForm({ id_paciente: "", fecha_hora: "", motivo_consulta: "", observaciones: "" });
    } catch {
      setError("No se pudo agendar la cita.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="doctor-page">
      <header className="doctor-page-header">
        <div>
          <h1>Agendar cita</h1>
          <p>Programa una cita para uno de tus pacientes.</p>
        </div>
      </header>

      {error && <div className="doctor-empty">{error}</div>}
      {mensaje && <div className="doctor-success">{mensaje}</div>}

      <form className="doctor-card doctor-form" onSubmit={handleSubmit}>
        <label>
          Paciente
          <select
            name="id_paciente"
            value={form.id_paciente}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona paciente</option>
            {pacientes.map((p) => (
              <option key={p.id_paciente} value={p.id_paciente}>
                {p.nombres} {p.apellido_paterno}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha y hora
          <input
            type="datetime-local"
            name="fecha_hora"
            value={form.fecha_hora}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Motivo de consulta
          <input
            name="motivo_consulta"
            value={form.motivo_consulta}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="doctor-button" disabled={saving}>
          {saving ? "Agendando..." : "Confirmar cita"}
        </button>
      </form>
    </section>
  );
}

export default DoctorAgendarCita;