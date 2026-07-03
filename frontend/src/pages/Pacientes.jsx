import React, { useEffect, useState } from "react";
import { getMisPacientes } from "../services/doctorService";
import "../styles/doctorPages.css";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getMisPacientes(search);
        setPacientes(data.pacientes || []);
        setError("");
      } catch {
        setError("AQUÍ CONECTA AL BACK BRAY: falta el endpoint /doctor/pacientes.");
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section className="doctor-page">
      <header className="doctor-page-header">
        <div>
          <h1>Mis pacientes</h1>
          <p>Pacientes con al menos una cita contigo.</p>
        </div>
      </header>

      <input
        className="doctor-search-input"
        type="text"
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <div className="doctor-empty">{error}</div>}

      {loading ? (
        <div className="doctor-empty">Cargando pacientes...</div>
      ) : pacientes.length === 0 ? (
        <div className="doctor-empty">No se encontraron pacientes.</div>
      ) : (
        <div className="doctor-list">
          {pacientes.map((paciente) => (
            <div className="doctor-list-item" key={paciente.id_paciente}>
              <div>
                <h4>
                  {paciente.nombres} {paciente.apellido_paterno}{" "}
                  {paciente.apellido_materno}
                </h4>
                <p>{paciente.correo_contacto || paciente.telefono}</p>
                <p>Última cita: {paciente.ultima_cita || "Sin registro"}</p>
              </div>
              <a className="doctor-button secondary" href={"/doctor/expediente/" + paciente.id_paciente}>
                Ver expediente
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Pacientes;