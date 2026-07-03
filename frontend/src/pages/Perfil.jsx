import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

/**
 * Página de perfil del usuario logueado (paciente o doctor).
 * Requiere: GET/PUT/DELETE /api/perfil, GET /api/especialidades
 *
 * Agrega la ruta en tu router, ej. en App.jsx:
 *   <Route path="/perfil" element={<Perfil />} />
 */

const styles = {
  page: { minHeight: "100vh", background: "#fdf5f8" },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    background: "#fff",
    borderBottom: "1px solid #f3d4e0",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "18px", color: "#222" },
  logoImg: { width: "32px", height: "32px" },
  backButton: { background: "transparent", border: "none", color: "#e91e63", fontWeight: 600, cursor: "pointer", fontSize: "14px" },
  container: { maxWidth: "640px", margin: "40px auto", padding: "0 20px" },
  card: { background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: "24px" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  avatarCircle: {
    width: "64px", height: "64px", borderRadius: "50%", background: "#e91e63", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "24px", flexShrink: 0,
  },
  title: { fontSize: "22px", fontWeight: 700, color: "#222", margin: 0 },
  subtitle: { fontSize: "14px", color: "#888", margin: "4px 0 0" },
  sectionTitle: { fontSize: "15px", fontWeight: 700, color: "#e91e63", marginTop: "28px", marginBottom: "4px" },
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px", marginTop: "14px" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e0c3cf", fontSize: "14px", boxSizing: "border-box" },
  select: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e0c3cf", fontSize: "14px", boxSizing: "border-box", background: "#fff" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e0c3cf", fontSize: "14px", boxSizing: "border-box", minHeight: "70px", resize: "vertical" },
  hint: { fontSize: "12px", color: "#999", marginTop: "4px" },
  primaryButton: { marginTop: "24px", width: "100%", padding: "12px", background: "#e91e63", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 600, fontSize: "15px", cursor: "pointer" },
  dangerZoneTitle: { fontSize: "16px", fontWeight: 700, color: "#e53935", marginBottom: "8px" },
  dangerZoneText: { fontSize: "13px", color: "#888", marginBottom: "16px" },
  dangerButton: { width: "100%", padding: "12px", background: "#fff", color: "#e53935", border: "1px solid #e53935", borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer" },
  successMsg: { background: "#e8f8ee", color: "#1e8e4a", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginTop: "16px" },
  errorMsg: { background: "#fdecea", color: "#c62828", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginTop: "16px" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "28px", maxWidth: "380px", width: "90%" },
  modalTitle: { fontSize: "18px", fontWeight: 700, marginBottom: "10px" },
  modalText: { fontSize: "14px", color: "#555", marginBottom: "20px" },
  modalActions: { display: "flex", gap: "10px" },
  modalCancel: { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600 },
  modalConfirm: { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#e53935", color: "#fff", cursor: "pointer", fontWeight: 600 },
};

const FORM_INICIAL = {
  // cuenta
  username: "",
  correo: "",
  password: "",
  // paciente
  nombres: "",
  apellido_paterno: "",
  apellido_materno: "",
  telefono: "",
  fecha_nacimiento: "",
  curp: "",
  correo_contacto: "",
  direccion: "",
  tipo_sangre: "",
  alergias: "",
  // doctor
  cedula_profesional: "",
  id_especialidad: "",
};

function Perfil() {
  const [usuarioBase, setUsuarioBase] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("paciente");
  const [form, setForm] = useState(FORM_INICIAL);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modalBorrarAbierto, setModalBorrarAbierto] = useState(false);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedTipo = localStorage.getItem("tipo_usuario") || "paciente";

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const usuario = JSON.parse(storedUser);
    setTipoUsuario(storedTipo);

    const cargarPerfil = fetch(`/api/perfil?id_usuario=${usuario.id_usuario}&tipo_usuario=${storedTipo}`)
      .then((res) => res.json());

    const cargarEspecialidades =
      storedTipo === "doctor"
        ? fetch("/api/especialidades").then((res) => res.json())
        : Promise.resolve({ especialidades: [] });

    Promise.all([cargarPerfil, cargarEspecialidades])
      .then(([dataPerfil, dataEsp]) => {
        if (dataPerfil.usuario) {
          setUsuarioBase(dataPerfil.usuario);
          const p = dataPerfil.perfil || {};
          setForm({
            ...FORM_INICIAL,
            username: dataPerfil.usuario.username || "",
            correo: dataPerfil.usuario.correo || "",
            nombres: p.nombres || "",
            apellido_paterno: p.apellido_paterno || "",
            apellido_materno: p.apellido_materno || "",
            telefono: p.telefono || "",
            fecha_nacimiento: p.fecha_nacimiento || "",
            curp: p.curp || "",
            correo_contacto: p.correo_contacto || "",
            direccion: p.direccion || "",
            tipo_sangre: p.tipo_sangre || "",
            alergias: p.alergias || "",
            cedula_profesional: p.cedula_profesional || "",
            id_especialidad: p.id_especialidad || "",
          });
        }
        setEspecialidades(dataEsp.especialidades || []);
      })
      .catch(() => setMensaje({ tipo: "error", texto: "No se pudo cargar tu perfil." }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setGuardando(true);

    try {
      const body = { id_usuario: usuarioBase.id_usuario, tipo_usuario: tipoUsuario, ...form };
      if (!body.password) delete body.password;

      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.message || "No se pudo actualizar." });
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      setUsuarioBase(data.usuario);
      setForm({ ...form, password: "" });
      setMensaje({ tipo: "ok", texto: "Perfil actualizado correctamente." });
    } catch (err) {
      setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
    } finally {
      setGuardando(false);
    }
  };

  const handleBorrarCuenta = async () => {
    setBorrando(true);
    try {
      await fetch(`/api/perfil?id_usuario=${usuarioBase.id_usuario}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      console.error("Error al borrar cuenta:", err);
    } finally {
      localStorage.removeItem("usuario");
      localStorage.removeItem("tipo_usuario");
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}><p>Cargando tu perfil...</p></div>
      </div>
    );
  }

  const iniciales = (form.nombres || form.username || "?").slice(0, 2).toUpperCase();

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <img src={logo} alt="GineSys" style={styles.logoImg} />
          <span>GineSys</span>
        </div>
        <button style={styles.backButton} onClick={() => (window.location.href = "/")}>
          ← Volver al inicio
        </button>
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.avatarCircle}>{iniciales}</div>
            <div>
              <h1 style={styles.title}>Mi perfil</h1>
              <p style={styles.subtitle}>{tipoUsuario === "doctor" ? "Cuenta de doctor/a" : "Cuenta de paciente"}</p>
            </div>
          </div>

          <form onSubmit={handleGuardar}>
            <div style={styles.sectionTitle}>Datos de la cuenta</div>

            <label style={styles.label}>Nombre de usuario</label>
            <input style={styles.input} type="text" name="username" value={form.username} onChange={handleChange} />

            <label style={styles.label}>Correo electrónico (para iniciar sesión)</label>
            <input style={styles.input} type="email" name="correo" value={form.correo} onChange={handleChange} />

            <label style={styles.label}>Nueva contraseña</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Déjalo vacío si no quieres cambiarla"
              value={form.password}
              onChange={handleChange}
            />
            <p style={styles.hint}>Mínimo 8 caracteres. Déjalo en blanco para conservar tu contraseña actual.</p>

            <div style={styles.sectionTitle}>Datos personales</div>

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Nombre(s)</label>
                <input style={styles.input} type="text" name="nombres" value={form.nombres} onChange={handleChange} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Apellido paterno</label>
                <input style={styles.input} type="text" name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Apellido materno</label>
                <input style={styles.input} type="text" name="apellido_materno" value={form.apellido_materno} onChange={handleChange} />
              </div>
            </div>

            <label style={styles.label}>Teléfono</label>
            <input style={styles.input} type="tel" name="telefono" value={form.telefono} onChange={handleChange} />

            {tipoUsuario === "doctor" ? (
              <>
                <label style={styles.label}>Cédula profesional</label>
                <input style={styles.input} type="text" name="cedula_profesional" value={form.cedula_profesional} onChange={handleChange} />

                <label style={styles.label}>Especialidad</label>
                <select style={styles.select} name="id_especialidad" value={form.id_especialidad} onChange={handleChange}>
                  <option value="">Selecciona una especialidad</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id_especialidad} value={esp.id_especialidad}>{esp.nombre}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Fecha de nacimiento</label>
                    <input style={styles.input} type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>CURP</label>
                    <input style={styles.input} type="text" name="curp" value={form.curp} onChange={handleChange} />
                  </div>
                </div>

                <label style={styles.label}>Correo de contacto</label>
                <input style={styles.input} type="email" name="correo_contacto" value={form.correo_contacto} onChange={handleChange} />

                <label style={styles.label}>Dirección</label>
                <input style={styles.input} type="text" name="direccion" value={form.direccion} onChange={handleChange} />

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Tipo de sangre</label>
                    <input style={styles.input} type="text" name="tipo_sangre" placeholder="Ej. O+" value={form.tipo_sangre} onChange={handleChange} />
                  </div>
                </div>

                <label style={styles.label}>Alergias</label>
                <textarea style={styles.textarea} name="alergias" value={form.alergias} onChange={handleChange} />
              </>
            )}

            {mensaje && (
              <div style={mensaje.tipo === "ok" ? styles.successMsg : styles.errorMsg}>{mensaje.texto}</div>
            )}

            <button type="submit" style={styles.primaryButton} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.dangerZoneTitle}>Zona de peligro</div>
          <p style={styles.dangerZoneText}>
            Al eliminar tu cuenta perderás acceso a tu historial, tus citas y no podrás recuperarla.
          </p>
          <button style={styles.dangerButton} onClick={() => setModalBorrarAbierto(true)}>
            Eliminar mi cuenta
          </button>
        </div>
      </div>

      {modalBorrarAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalTitle}>¿Eliminar tu cuenta?</div>
            <p style={styles.modalText}>
              Esta acción no se puede deshacer. Se borrará tu cuenta y tu acceso a GineSys.
            </p>
            <div style={styles.modalActions}>
              <button style={styles.modalCancel} onClick={() => setModalBorrarAbierto(false)} disabled={borrando}>
                Cancelar
              </button>
              <button style={styles.modalConfirm} onClick={handleBorrarCuenta} disabled={borrando}>
                {borrando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;