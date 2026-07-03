import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdf5f8, #fff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 15px",
  },
  container: { width: "100%", maxWidth: "720px" },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #f3e6eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "24px", fontWeight: 700 },
  subtitle: { fontSize: "13px", color: "#777" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginTop: "6px",
  },
  hint: { fontSize: "12px", color: "#999", marginTop: "4px" },
  button: {
    marginTop: "22px",
    width: "100%",
    padding: "13px",
    background: "#e91e63",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  success: {
    background: "#e8f8ee",
    color: "#1e8e4a",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
  },
  error: {
    background: "#fdecea",
    color: "#c62828",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
  },
};

export default function AgendarCita() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [buscandoDoctores, setBuscandoDoctores] = useState(false);
  const [form, setForm] = useState({
    especialidad: "",
    doctor: "",
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");

    if (!stored) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));

    const cargarEspecialidades = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/especialidades");
        if (!res.ok) return;
        const data = await res.json();
        setEspecialidades(data.especialidades || data || []);
      } catch (err) {
        console.error(err);
      }
    };

    cargarEspecialidades();
  }, []);

  // Cada vez que cambian especialidad, fecha u hora, recalculamos qué
  // doctores están disponibles. Si el doctor elegido ya no aparece en la
  // lista (porque se ocupó ese horario), se limpia la selección.
  useEffect(() => {
    if (!form.especialidad) {
      setDoctores([]);
      return;
    }

    const cargarDoctoresDisponibles = async () => {
      setBuscandoDoctores(true);
      try {
        const params = new URLSearchParams({ id_especialidad: form.especialidad });

        if (form.fecha && form.hora) {
          params.set("fecha_hora", `${form.fecha} ${form.hora}:00`);
        }

        const res = await fetch(
          `http://localhost:8000/api/doctores/disponibles?${params.toString()}`
        );

        if (!res.ok) return;

        const data = await res.json();
        const lista = data.doctores || [];
        setDoctores(lista);

        if (form.doctor && !lista.some((d) => String(d.id_doctor) === String(form.doctor))) {
          setForm((prev) => ({ ...prev, doctor: "" }));
          if (form.fecha && form.hora) {
            setMensaje({
              type: "error",
              text: "El doctor seleccionado ya no está disponible en ese horario, elige otro.",
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setBuscandoDoctores(false);
      }
    };

    cargarDoctoresDisponibles();
  }, [form.especialidad, form.fecha, form.hora]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // Si cambia la especialidad, se resetea el doctor elegido.
      if (name === "especialidad") {
        return { ...prev, especialidad: value, doctor: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const agendar = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch("http://localhost:8000/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_usuario: user.id_usuario,
            id_doctor: form.doctor,
            fecha_hora: `${form.fecha} ${form.hora}`,
            motivo_consulta: form.motivo,
            observaciones: form.observaciones,
          }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ type: "error", text: data.message });
        return;
      }

      setMensaje({ type: "ok", text: "Cita agendada correctamente" });

      setForm({
        especialidad: "",
        doctor: "",
        fecha: "",
        hora: "",
        motivo: "",
        observaciones: "",
      });
    } catch (err) {
      setMensaje({ type: "error", text: "Error de servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h2 style={styles.title}>Agendar cita</h2>
              <p style={styles.subtitle}>Selecciona especialidad y doctor</p>
            </div>

            <button style={styles.backButton} onClick={() => navigate("/")}>
              Inicio
            </button>
          </div>

          <form onSubmit={agendar}>
            <select
              name="especialidad"
              style={styles.input}
              value={form.especialidad}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona especialidad</option>
              {especialidades.map((esp) => (
                <option key={esp.id_especialidad} value={esp.id_especialidad}>
                  {esp.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="fecha"
              style={styles.input}
              value={form.fecha}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="hora"
              style={styles.input}
              value={form.hora}
              onChange={handleChange}
              required
            />

            <select
              name="doctor"
              style={styles.input}
              value={form.doctor}
              onChange={handleChange}
              disabled={!form.especialidad}
              required
            >
              <option value="">
                {!form.especialidad
                  ? "Primero selecciona una especialidad"
                  : buscandoDoctores
                  ? "Buscando doctores disponibles..."
                  : doctores.length === 0
                  ? "No hay doctores disponibles"
                  : "Selecciona doctor"}
              </option>
              {doctores.map((d) => (
                <option key={d.id_doctor} value={d.id_doctor}>
                  {d.nombre}
                </option>
              ))}
            </select>
            {form.especialidad && form.fecha && form.hora && (
              <p style={styles.hint}>
                Mostrando solo doctores libres alrededor de esa hora.
              </p>
            )}

            <input name="motivo" style={styles.input} value={form.motivo} onChange={handleChange} placeholder="Motivo" />

            <textarea
              name="observaciones"
              style={styles.input}
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Observaciones"
            />

            {mensaje && (
              <div style={mensaje.type === "ok" ? styles.success : styles.error}>
                {mensaje.text}
              </div>
            )}

            <button style={styles.button} disabled={loading}>
              {loading ? "Agendando..." : "Confirmar cita"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}