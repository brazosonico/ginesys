import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { crearReceta } from "../services/doctorService";
import "../styles/doctorPages.css";

const nuevoMedicamento = () => ({
  id: crypto.randomUUID(),
  nombre: "",
  dosis: "",
  frecuencia: "",
  duracion: "",
  indicaciones: "",
});

function DoctorReceta() {
  const { citaId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Si el doctor llega por link directo (recarga de página) y no hay state,
  // al menos mostramos el id de la cita en vez de romper la pantalla.
  const patientName = state?.patientName || "Paciente";
  const patientId = state?.patientId || null;

  const [diagnostico, setDiagnostico] = useState("");
  const [medicamentos, setMedicamentos] = useState([nuevoMedicamento()]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function actualizarMedicamento(id, campo, valor) {
    setMedicamentos((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [campo]: valor } : med))
    );
  }

  function agregarMedicamento() {
    setMedicamentos((prev) => [...prev, nuevoMedicamento()]);
  }

  function quitarMedicamento(id) {
    setMedicamentos((prev) => prev.filter((med) => med.id !== id));
  }

  async function guardarReceta(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    try {
      await crearReceta({
        citaId,
        patientId,
        diagnostico,
        medicamentos,
      });
      navigate("/doctor");
    } catch (error) {
      setMensaje(
        "AQUÍ CONECTA AL BACK BRAY: falta conectar el endpoint para guardar la receta."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="doctor-page">
      <header className="doctor-page-header">
        <div>
          <h1>Receta médica</h1>
          <p>
            Paciente: <strong>{patientName}</strong> · Cita #{citaId}
          </p>
        </div>
      </header>

      {mensaje && <div className="doctor-empty">{mensaje}</div>}

      <form className="doctor-card" onSubmit={guardarReceta}>
        <label htmlFor="diagnostico">Diagnóstico</label>
        <textarea
          id="diagnostico"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          placeholder="Escribe el diagnóstico de la consulta..."
          rows={3}
          required
        />

        <h2>Medicamentos</h2>

        <div className="doctor-list">
          {medicamentos.map((med, index) => (
            <div className="doctor-list-item stacked" key={med.id}>
              <div className="doctor-grid two-columns">
                <input
                  type="text"
                  placeholder="Medicamento"
                  value={med.nombre}
                  onChange={(e) => actualizarMedicamento(med.id, "nombre", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosis (ej. 500mg)"
                  value={med.dosis}
                  onChange={(e) => actualizarMedicamento(med.id, "dosis", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Frecuencia (ej. cada 8 horas)"
                  value={med.frecuencia}
                  onChange={(e) => actualizarMedicamento(med.id, "frecuencia", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Duración (ej. 7 días)"
                  value={med.duracion}
                  onChange={(e) => actualizarMedicamento(med.id, "duracion", e.target.value)}
                  required
                />
              </div>
              <textarea
                placeholder="Indicaciones adicionales"
                value={med.indicaciones}
                onChange={(e) => actualizarMedicamento(med.id, "indicaciones", e.target.value)}
                rows={2}
              />

              {medicamentos.length > 1 && (
                <button
                  type="button"
                  className="doctor-button secondary"
                  onClick={() => quitarMedicamento(med.id)}
                >
                  Quitar medicamento {index + 1}
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="doctor-button secondary" onClick={agregarMedicamento}>
          + Agregar medicamento
        </button>

        <div className="doctor-list-item-actions">
          <button type="button" className="doctor-button secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="doctor-button" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar receta"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default DoctorReceta;