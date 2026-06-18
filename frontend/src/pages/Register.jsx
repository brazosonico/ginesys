import { useState } from "react";
import { styles } from "../styles/homeStyles";

function Register() {
  const [tipoUsuario, setTipoUsuario] = useState("paciente");

  return (
    
    <div style={styles.loginPage}>
      <div style={styles.registerContainer}>
<button

              style={styles.backHomeButton}
              onClick={() => window.location.href = "/"}
            >
              ← Inicio
            </button>
        <h1 style={styles.loginTitle}>
          Crear cuenta
        </h1>

        <p style={styles.loginSubtitle}>
          Regístrate para acceder a todos los servicios médicos
        </p>

        <div style={styles.userTypeGrid}>
          <button
            type="button"
            style={
              tipoUsuario === "paciente"
                ? styles.userTypeActive
                : styles.userType
            }
            onClick={() => setTipoUsuario("paciente")}
          >
            👩‍⚕️
            <br />
            Soy paciente
          </button>

          <button
            type="button"
            style={
              tipoUsuario === "doctor"
                ? styles.userTypeActive
                : styles.userType
            }
            onClick={() => setTipoUsuario("doctor")}
          >
            🩺
            <br />
            Soy doctor
          </button>
        </div>

        <form style={styles.loginForm}>

          <label style={styles.formLabel}>
            👤 Nombre completo
          </label>

          <input
            type="text"
            placeholder="Ingresa tu nombre completo"
            style={styles.formInput}
          />

          <label style={styles.formLabel}>
            📧 Correo electrónico
          </label>

          <input
            type="email"
            placeholder="correo@ejemplo.com"
            style={styles.formInput}
          />

          <label style={styles.formLabel}>
            🔒 Contraseña
          </label>

          <input
            type="password"
            placeholder="********"
            style={styles.formInput}
          />

          <label style={styles.formLabel}>
            🔐 Confirmar contraseña
          </label>

          <input
            type="password"
            placeholder="********"
            style={styles.formInput}
          />

          <button
            type="submit"
            style={styles.loginSubmit}
          >
            Crear cuenta
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;