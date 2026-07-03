import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { getMisCitas, actualizarCita, cancelarCita, getRecetaPorCita } from "../services/citaService";

const styles = {
  page: { minHeight: "100vh", background: "#fdf5f8" },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px", background: "#fff", borderBottom: "1px solid #f3d4e0",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "18px", color: "#222" },
  logoImg: { width: "32px", height: "32px" },
  backButton: { background: "transparent", border: "none", color: "#e91e63", fontWeight: 600, cursor: "pointer", fontSize: "14px" },
  container: { maxWidth: "760px", margin: "40px auto", padding: "0 20px" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: 700, color: "#222", margin: 0 },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  tab: { padding: "8px 16px", borderRadius: "999px", border: "1px solid #f3d4e0", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#555", cursor: "pointer" },
  tabActive: { padding: "8px 16px", borderRadius: "999px", border: "1px solid #e91e63", background: "#e91e63", fontSize: "13px", fontWeight: 600, color: "#fff", cursor: "pointer" },
  card: {
    background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 3px 14px rgba(0,0,0,0.05)",
    marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap",
  },
  fecha: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "60px" },
  fechaDia: { fontSize: "20px", fontWeight: 700, color: "#e91e63" },
  fechaMes: { fontSize: "12px", color: "#999", textTransform: "uppercase" },
  info: { flex: 1, minWidth: "180px" },
  motivo: { fontSize: "15px", fontWeight: 700, color: "#222" },
  detalle: { fontSize: "13px", color: "#777", marginTop: "2px" },
  badge: (color, bg) => ({ fontSize: "12px", fontWeight: 600, color, background: bg, padding: "4px 10px", borderRadius: "999px", textTransform: "capitalize" }),
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#999" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  actionBtn: {
    fontSize: "12.5px", fontWeight: 600, padding: "7px 14px", borderRadius: "10px",
    border: "1.5px solid #e91e63", background: "#fff", color: "#e91e63", cursor: "pointer",
  },
  actionBtnDanger: {
    fontSize: "12.5px", fontWeight: 600, padding: "7px 14px", borderRadius: "10px",
    border: "1.5px solid #c62828", background: "#fff", color: "#c62828", cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px",
  },
  modalCard: {
    background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "440px",
  },
  modalCardWide: {
    background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "520px",
    maxHeight: "80vh", overflowY: "auto",
  },
  modalTitle: { fontSize: "18px", fontWeight: 700, marginBottom: "18px" },
  formLabel: { display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px", marginTop: "14px" },
  formInput: { width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px" },
  modalActions: { display: "flex", gap: "10px", marginTop: "24px" },
  modalBtnPrimary: {
    flex: 1, padding: "12px", borderRadius: "10px", border: "none",
    background: "#e91e63", color: "#fff", fontWeight: 700, cursor: "pointer",
  },
  modalBtnSecondary: {
    flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #ddd",
    background: "#fff", color: "#555", fontWeight: 600, cursor: "pointer",
  },
  recetaDiagnosticoBox: {
    background: "#fdf5f8", borderRadius: "10px", padding: "12px 14px", fontSize: "14px",
    color: "#333", marginBottom: "16px",
  },
  medCard: {
    border: "1px solid #f0e0e6", borderRadius: "12px", padding: "14px", marginBottom: "10px",
  },
  medNombre: { fontSize: "14.5px", fontWeight: 700, color: "#222" },
  medDetalle: { fontSize: "13px", color: "#666", marginTop: "3px" },
};

const ESTADOS = ["todas", "programada", "confirmada", "en_curso", "completada", "cancelada", "no_asistio"];

const ESTADO_LABEL = {
  todas: "Todas",
  programada: "Programada",
  confirmada: "Confirmada",
  en_curso: "En curso",
  completada: "Finalizada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

const ESTADO_STYLE = {
  programada: styles.badge("#a15c00", "#fff3e0"),
  confirmada: styles.badge("#1e8e4a", "#e8f8ee"),
  en_curso: styles.badge("#1565c0", "#e3f2fd"),
  completada: styles.badge("#555555", "#eeeeee"),
  cancelada: styles.badge("#c62828", "#fdecea"),
  no_asistio: styles.badge("#c62828", "#fdecea"),
};

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function formatearFechaHora(fechaHoraStr) {
  const fecha = new Date(fechaHoraStr);
  const hora = fecha.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return { dia: fecha.getDate(), mes: MESES[fecha.getMonth()], hora };
}

function nombreCompleto(persona) {
  if (!persona) return null;
  return [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(" ");
}

function toDatetimeLocalValue(fechaHoraStr) {
  const fecha = new Date(fechaHoraStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [tipoUsuario, setTipoUsuario] = useState("paciente");
  const [citaEditando, setCitaEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ fecha_hora: "", motivo_consulta: "", observaciones: "" });
  const [guardando, setGuardando] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState("");

  // Estado para el modal de "Ver receta"
  const [citaReceta, setCitaReceta] = useState(null);
  const [receta, setReceta] = useState(null);
  const [cargandoReceta, setCargandoReceta] = useState(false);
  const [errorReceta, setErrorReceta] = useState("");

  useEffect(() => {
    cargarCitas();
  }, []);

  function cargarCitas() {
    const storedUser = localStorage.getItem("usuario");
    const storedTipo = localStorage.getItem("tipo_usuario") || "paciente";

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const usuario = JSON.parse(storedUser);
    setTipoUsuario(storedTipo);
    setLoading(true);

    getMisCitas(usuario.id_usuario, storedTipo)
      .then((data) => setCitas(data.citas || []))
      .catch(() => setError("No se pudieron cargar tus citas."))
      .finally(() => setLoading(false));
  }

  const citasFiltradas = citas.filter((c) => filtro === "todas" || c.estado === filtro);

  function abrirEdicion(cita) {
    setCitaEditando(cita);
    setFormEdit({
      fecha_hora: toDatetimeLocalValue(cita.fecha_hora),
      motivo_consulta: cita.motivo_consulta || "",
      observaciones: cita.observaciones || "",
    });
    setMensajeAccion("");
  }

  function cerrarEdicion() {
    setCitaEditando(null);
  }

  async function guardarEdicion(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await actualizarCita(citaEditando.id_cita, {
        fecha_hora: formEdit.fecha_hora.replace("T", " "),
        motivo_consulta: formEdit.motivo_consulta,
        observaciones: formEdit.observaciones,
      });
      setMensajeAccion("Cita actualizada correctamente.");
      cerrarEdicion();
      cargarCitas();
    } catch {
      setMensajeAccion("No se pudo actualizar la cita.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleCancelar(cita) {
    const confirmado = window.confirm(
      `¿Seguro que quieres cancelar la cita del ${new Date(cita.fecha_hora).toLocaleDateString("es-MX")}?`
    );
    if (!confirmado) return;

    try {
      await cancelarCita(cita.id_cita);
      cargarCitas();
    } catch {
      setMensajeAccion("No se pudo cancelar la cita.");
    }
  }

  async function verReceta(cita) {
    setCitaReceta(cita);
    setReceta(null);
    setErrorReceta("");
    setCargandoReceta(true);

    const storedUser = JSON.parse(localStorage.getItem("usuario"));

    try {
      const data = await getRecetaPorCita(cita.id_cita, storedUser.id_usuario);
      setReceta(data);
    } catch {
      setErrorReceta("Esta cita todavía no tiene una receta registrada.");
    } finally {
      setCargandoReceta(false);
    }
  }

  function cerrarReceta() {
    setCitaReceta(null);
    setReceta(null);
    setErrorReceta("");
  }

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
        <div style={styles.titleRow}>
          <h1 style={styles.title}>{tipoUsuario === "doctor" ? "Mi agenda" : "Mis citas"}</h1>
        </div>

        <div style={styles.tabs}>
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              style={filtro === estado ? styles.tabActive : styles.tab}
              onClick={() => setFiltro(estado)}
            >
              {ESTADO_LABEL[estado]}
            </button>
          ))}
        </div>

        {mensajeAccion && <p style={{ color: "#1e8e4a", fontWeight: 600 }}>{mensajeAccion}</p>}
        {loading && <p>Cargando tus citas...</p>}
        {error && <p style={{ color: "#c62828" }}>{error}</p>}

        {!loading && !error && citasFiltradas.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <p>
              No tienes citas {filtro !== "todas" ? `en estado "${ESTADO_LABEL[filtro]}"` : "registradas"} por ahora.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          citasFiltradas.map((cita) => {
            const { dia, mes, hora } = formatearFechaHora(cita.fecha_hora);
            const otraPersona =
              tipoUsuario === "doctor"
                ? nombreCompleto(cita.paciente) || "Paciente"
                : nombreCompleto(cita.doctor)
                ? `Dr(a). ${nombreCompleto(cita.doctor)}`
                : "Por asignar";
            const especialidad = cita.doctor?.especialidad?.nombre;
            const puedeEditar = cita.estado === "programada" || cita.estado === "confirmada";
            const tieneReceta = cita.estado === "completada";

            return (
              <div key={cita.id_cita} style={styles.card}>
                <div style={styles.fecha}>
                  <div style={styles.fechaDia}>{dia}</div>
                  <div style={styles.fechaMes}>{mes}</div>
                </div>

                <div style={styles.info}>
                  <div style={styles.motivo}>{cita.motivo_consulta || "Consulta"}</div>
                  <div style={styles.detalle}>
                    {hora} · {tipoUsuario === "doctor" ? "Paciente" : "Doctor/a"}: {otraPersona}
                    {tipoUsuario === "paciente" && especialidad ? ` · ${especialidad}` : ""}
                  </div>
                  {cita.observaciones && <div style={styles.detalle}>Notas: {cita.observaciones}</div>}
                </div>

                <span style={ESTADO_STYLE[cita.estado] || styles.badge("#555555", "#eeeeee")}>
                  {ESTADO_LABEL[cita.estado] || cita.estado}
                </span>

                <div style={styles.actions}>
                  {tieneReceta && (
                    <button style={styles.actionBtn} onClick={() => verReceta(cita)}>
                      Ver receta
                    </button>
                  )}
                  {puedeEditar && (
                    <>
                      <button style={styles.actionBtn} onClick={() => abrirEdicion(cita)}>
                        Reagendar
                      </button>
                      <button style={styles.actionBtnDanger} onClick={() => handleCancelar(cita)}>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {citaEditando && (
        <div style={styles.modalOverlay} onClick={cerrarEdicion}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Reagendar cita</div>

            <form onSubmit={guardarEdicion}>
              <label style={styles.formLabel}>Fecha y hora</label>
              <input
                type="datetime-local"
                style={styles.formInput}
                value={formEdit.fecha_hora}
                onChange={(e) => setFormEdit({ ...formEdit, fecha_hora: e.target.value })}
                required
              />

              <label style={styles.formLabel}>Motivo de consulta</label>
              <input
                type="text"
                style={styles.formInput}
                value={formEdit.motivo_consulta}
                onChange={(e) => setFormEdit({ ...formEdit, motivo_consulta: e.target.value })}
              />

              <label style={styles.formLabel}>Observaciones</label>
              <textarea
                style={{ ...styles.formInput, minHeight: "70px", resize: "vertical" }}
                value={formEdit.observaciones}
                onChange={(e) => setFormEdit({ ...formEdit, observaciones: e.target.value })}
              />

              <div style={styles.modalActions}>
                <button type="button" style={styles.modalBtnSecondary} onClick={cerrarEdicion}>
                  Cancelar
                </button>
                <button type="submit" style={styles.modalBtnPrimary} disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {citaReceta && (
        <div style={styles.modalOverlay} onClick={cerrarReceta}>
          <div style={styles.modalCardWide} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Receta médica</div>

            {cargandoReceta && <p>Cargando receta...</p>}
            {errorReceta && <p style={{ color: "#c62828" }}>{errorReceta}</p>}

            {receta && (
              <>
                {receta.diagnostico && (
                  <div style={styles.recetaDiagnosticoBox}>
                    <strong>Diagnóstico:</strong> {receta.diagnostico}
                    {receta.fecha_emision && (
                      <div style={{ marginTop: "4px", color: "#999", fontSize: "12px" }}>
                        Emitida el {receta.fecha_emision}
                      </div>
                    )}
                  </div>
                )}

                {receta.medicamentos?.map((med) => (
                  <div key={med.id} style={styles.medCard}>
                    <div style={styles.medNombre}>{med.nombre}</div>
                    <div style={styles.medDetalle}>
                      {med.dosis} · {med.frecuencia} · {med.duracion}
                    </div>
                    {med.indicaciones && <div style={styles.medDetalle}>{med.indicaciones}</div>}
                  </div>
                ))}
              </>
            )}

            <div style={styles.modalActions}>
              <button type="button" style={styles.modalBtnPrimary} onClick={cerrarReceta}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisCitas;