import React, { useEffect, useState } from "react";
import {
  getPerfilDoctor,
  updatePerfilDoctor,
  getEspecialidades,
} from "../services/doctorService";
import "../styles/doctorPages.css";

const initialForm = {
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  telefono: "",
  cedula_profesional: "",
  id_especialidad: "",
  correo: "",
};

function PerfilDoctor() {
  const [form, setForm] = useState(initialForm);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [perfil, especialidadesData] = await Promise.all([
          getPerfilDoctor(),
          getEspecialidades(),
        ]);
        setForm({ ...initialForm, ...perfil });
        setEspecialidades(especialidadesData.especialidades || []);
      } catch {
        setError("AQUÍ CONECTA AL BACK BRAY: falta /doctor/perfil o /especialidades.");
      } finally {
        setLoading(false);
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
      await updatePerfilDoctor(form);
      setMensaje("Datos actualizados correctamente.");
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="doctor-page">
        <div className="doctor-empty">Cargando perfil...</div>
      </section>
    );
  }

  return (
    <section className="doctor-page">
      <header className="doctor-page-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Consulta y actualiza tus datos profesionales.</p>
        </div>
      </header>

      {error && <div className="doctor-empty">{error}</div>}
      {mensaje && <div className="doctor-success">{mensaje}</div>}

      <form className="doctor-card doctor-form" onSubmit={handleSubmit}>
        <label>
          Nombre(s)
          <input
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Apellido paterno
          <input
            name="apellido_paterno"
            value={form.apellido_paterno}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Apellido materno
          <input
            name="apellido_materno"
            value={form.apellido_materno}
            onChange={handleChange}
          />
        </label>

        <label>
  Cédula profesional
  <input
    name="cedula_profesional"
    value={form.cedula_profesional}
    onChange={handleChange}
    placeholder="Ej. 12345678"
    required
  />
</label>

        <label>
          Teléfono
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Especialidad
          <select
            name="id_especialidad"
            value={form.id_especialidad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.id_especialidad} value={esp.id_especialidad}>
                {esp.nombre}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="doctor-button" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}

export default PerfilDoctor;