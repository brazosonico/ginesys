import { useState } from "react";
import { styles } from "../styles/homeStyles";

function Register() {
    const [tipoUsuario, setTipoUsuario] = useState("paciente");
    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    nombre: form.nombre,
                    correo: form.correo,
                    password: form.password,
                    password_confirmation: form.password_confirmation,
                    tipo_usuario: tipoUsuario,
                }),
            });

            const data = await response.json().catch(() => ({
                message: "Error inesperado del servidor"
            }));

            if (!response.ok) {
                const mensajes = data.errors
                    ? Object.values(data.errors).flat().join("\n")
                    : data.message || "Error al registrar";
                setError(mensajes);
                return;
            }

            alert("¡Cuenta creada correctamente!");
            window.location.href = "/login";

        } catch (err) {
            setError("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.loginPage}>
            <div style={styles.registerContainer}>
                <button
                    style={styles.backHomeButton}
                    onClick={() => window.location.href = "/"}
                >
                    ← Inicio
                </button>
                <h1 style={styles.loginTitle}>Crear cuenta</h1>
                <p style={styles.loginSubtitle}>
                    Regístrate para acceder a todos los servicios médicos
                </p>

                <div style={styles.userTypeGrid}>
                    <button
                        type="button"
                        style={tipoUsuario === "paciente" ? styles.userTypeActive : styles.userType}
                        onClick={() => setTipoUsuario("paciente")}
                    >
                        👩‍⚕️<br />Soy paciente
                    </button>
                    <button
                        type="button"
                        style={tipoUsuario === "doctor" ? styles.userTypeActive : styles.userType}
                        onClick={() => setTipoUsuario("doctor")}
                    >
                        🩺<br />Soy doctor
                    </button>
                </div>

                {error && (
                    <p style={{ color: "red", whiteSpace: "pre-line", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}

                <form style={styles.loginForm} onSubmit={handleSubmit}>
                    <label style={styles.formLabel}>👤 Nombre completo</label>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Ingresa tu nombre completo"
                        style={styles.formInput}
                        value={form.nombre}
                        onChange={handleChange}
                    />
                    <label style={styles.formLabel}>📧 Correo electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        placeholder="correo@ejemplo.com"
                        style={styles.formInput}
                        value={form.correo}
                        onChange={handleChange}
                    />
                    <label style={styles.formLabel}>🔒 Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="********"
                        style={styles.formInput}
                        value={form.password}
                        onChange={handleChange}
                    />
                    <label style={styles.formLabel}>🔐 Confirmar contraseña</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="********"
                        style={styles.formInput}
                        value={form.password_confirmation}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        style={styles.loginSubmit}
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;