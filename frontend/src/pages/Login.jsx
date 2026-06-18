import { useState } from "react";
import { styles } from "../styles/homeStyles";
import logo from "../assets/logo.png";

function Login() {

  const [tipoUsuario, setTipoUsuario] = useState("paciente");

  return (

    <div style={styles.loginPage}>

      <div style={styles.loginCard}>

        {/* TOP */}

        <div style={styles.loginTop}>

          <div style={styles.loginTopLeft}>

            <button
              style={styles.backHomeButton}
              onClick={() => window.location.href = "/"}
            >
              ← Inicio
            </button>

            <div style={styles.loginBrand}>

              <img
                src={logo}
                alt="GineSys"
                style={styles.loginLogo}
              />

              <strong>GineSys</strong>

            </div>

          </div>

          <span style={styles.loginRegisterText}>

            ¿No tienes cuenta?

            {" "}

            <button
  style={styles.textButton}
  onClick={() => window.location.href = "/registro"}
>
  Regístrate
</button>

          </span>

        </div>

        {/* CONTENT */}

        <div style={styles.loginContent}>

          {/* LEFT */}

          <aside style={styles.loginLeft}>

            <p style={styles.eyebrow}>
              BIENVENIDA DE VUELTA
            </p>

            <h2 style={styles.loginLeftTitle}>
              Tu salud en un solo lugar,
              siempre contigo
            </h2>

            <p style={styles.loginLeftText}>
              Accede a tu expediente,
              revisa tus estudios y agenda citas
              con tu especialista desde cualquier dispositivo.
            </p>

            <div style={styles.loginBenefits}>

              <div style={styles.loginBenefitItem}>

                <div style={styles.loginBenefitIcon}>
                  📁
                </div>

                <div>
                  <strong>Expediente digital</strong>
                  <br />
                  Consulta tu historial clínico completo.
                </div>

              </div>

              <div style={styles.loginBenefitItem}>

                <div style={styles.loginBenefitIcon}>
                  📅
                </div>

                <div>
                  <strong>Citas en línea</strong>
                  <br />
                  Agenda o reagenda sin llamar al consultorio.
                </div>

              </div>

              <div style={styles.loginBenefitItem}>

                <div style={styles.loginBenefitIcon}>
                  🤖
                </div>

                <div>
                  <strong>Asistente IA 24/7</strong>
                  <br />
                  Resuelve dudas sobre tus estudios.
                </div>

              </div>

            </div>

          </aside>

          {/* RIGHT */}

          <main style={styles.loginRight}>

            <h1 style={styles.loginTitle}>
              Iniciar sesión
            </h1>

            <p style={styles.loginSubtitle}>
              Selecciona tu tipo de usuario para continuar
            </p>

            <div style={styles.userTypeGrid}>

              <button
                style={
                  tipoUsuario === "paciente"
                    ? styles.userTypeActive
                    : styles.userType
                }
                onClick={() => setTipoUsuario("paciente")}
              >

                <div style={styles.userTypeIcon}>
                  👩‍⚕️
                </div>

                Soy paciente

              </button>

              <button
                style={
                  tipoUsuario === "doctor"
                    ? styles.userTypeActive
                    : styles.userType
                }
                onClick={() => setTipoUsuario("doctor")}
              >

                <div style={styles.userTypeIcon}>
                  🩺
                </div>

                Soy doctor

              </button>

            </div>

            <form style={styles.loginForm}>

              <label style={styles.formLabel}>
                📧 Correo electrónico
              </label>

              <input
                style={styles.formInput}
                type="email"
                placeholder="correo@ejemplo.com"
              />

              <label style={styles.formLabel}>
                🔒 Contraseña
              </label>

              <input
                style={styles.formInput}
                type="password"
                placeholder="********"
              />

              <button
                type="button"
                style={styles.forgotButton}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <button
                type="submit"
                style={styles.loginSubmit}
              >
                Entrar
              </button>

              <div style={styles.divider}>
                o continúa con
              </div>

              <div style={styles.socialGrid}>

                <button
                  type="button"
                  style={styles.socialButton}
                >
                   Google
                </button>

                <button
                  type="button"
                  style={styles.socialButton}
                >
                   Facebook
                </button>

              </div>

              <p style={styles.bottomText}>

                ¿No tienes cuenta?

                {" "}

                <button
  type="button"
  style={styles.textButton}
  onClick={() => window.location.href = "/registro"}
>
  Regístrate aquí
</button>

              </p>

            </form>

          </main>

        </div>

      </div>

    </div>

  );
}

export default Login;