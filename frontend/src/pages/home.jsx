import { useState } from "react";
import { styles } from "../styles/homeStyles";
import logo from "../assets/logo.png";
<><img src={logo} alt="Logo GineSys" style={styles.logoImage} /><span>GineSys</span></>
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const irLogin = () => {
    window.location.href = "/login";
  };

  const irRegistro = () => {
    window.location.href = "/registro";
  };

  const irSeccion = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const links = [
    { texto: "Inicio", id: "#inicio" },
    { texto: "Especialidades", id: "#especialidades" },
    { texto: "¿Cómo funciona?", id: "#como-funciona" },
    { texto: "Nosotros", id: "#nosotros" },
    { texto: "Contacto", id: "#contacto" },
  ];

   

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <button style={styles.logo} onClick={() => irSeccion("#inicio")}>
            <img src={logo} alt="Logo GineSys" style={styles.logoImage} />
            <span>GineSys</span>
          </button>

          <div style={styles.navLinks}>
            {links.map((link) => (
              <button key={link.id} style={styles.navLink} onClick={() => irSeccion(link.id)}>
                {link.texto}
              </button>
            ))}
          </div>

          <button
  id="btn-login"
  name="btn-login"
  style={styles.outlineButton}
  onClick={irLogin}
>
  Iniciar sesión
</button>

<button
  id="btn-register"
  name="btn-register"
  style={styles.primaryButton}
  onClick={irRegistro}
>
  Registrarse
</button>
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>

          {menuOpen && (
            <div style={styles.mobileDropdown}>
              {links.map((link) => (
                <button key={link.id} style={styles.mobileLink} onClick={() => irSeccion(link.id)}>
                  {link.texto}
                </button>
              ))}
              <button style={styles.outlineButton} onClick={irLogin}>Iniciar sesión</button>
              <button style={styles.primaryButton} onClick={irRegistro}>Registrarse</button>
            </div>
          )}
        </div>
      </nav>

      <header id="inicio" style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badge}>Plataforma médica segura y confiable</div>

          <h1 style={styles.heroTitle}>
            Tu salud femenina,
            <span style={styles.pinkText}>siempre bien atendida</span>
          </h1>

          <p style={styles.heroText}>
            Gestiona tus citas, consulta tu historial clínico y comunícate con tu doctora desde cualquier dispositivo.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={irRegistro}>Registrarme ahora</button>
            <button style={styles.outlineButton} onClick={() => irSeccion("#especialidades")}>Conocer más</button>
          </div>
        </div>
      </header>

      <section id="especialidades" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Especialidades</h2>
 
          <div style={styles.specialtyGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Ginecología</h3>
              <p style={styles.cardText}>Revisiones de rutina, PAP, ciclo menstrual y métodos anticonceptivos.</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Obstetricia</h3>
              <p style={styles.cardText}>Control prenatal, embarazo, monitoreo fetal y atención postparto.</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Mastología</h3>
              <p style={styles.cardText}>Exploración mamaria, mastografías y detección temprana de cáncer.</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Asistente IA</h3>
              <p style={styles.cardText}>Resuelve dudas sobre tratamientos y citas en cualquier momento.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" style={styles.altSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>¿Cómo funciona?</h2>

          <div style={styles.stepsGrid}>
            <div>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.cardTitle}>Crea tu cuenta</h3>
              <p style={styles.cardText}>Regístrate con tu correo y llena tu perfil médico.</p>
            </div>

            <div>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.cardTitle}>Agenda tu cita</h3>
              <p style={styles.cardText}>Elige especialidad, doctora y horario disponible.</p>
            </div>

            <div>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.cardTitle}>Consulta tu historial</h3>
              <p style={styles.cardText}>Accede a estudios, recetas y notas médicas.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Nosotros</h2>

          <div style={styles.aboutGrid}>
            <div>
              <p style={styles.sectionText}>
                GineSys nace para digitalizar la atención médica femenina.
              </p>

              <div style={styles.list}>
                <span>✓ Expediente clínico digital</span>
                <span>✓ Monitoreo IoT en tiempo real</span>
                <span>✓ Chatbot IA para pacientes y doctores</span>
                <span>✓ Sin restricción de edad</span>
                <span>✓ Equipo médico completo</span>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}><div style={styles.statValue}>3</div>Especialidades</div>
              <div style={styles.statCard}><div style={styles.statValue}>24/7</div>Asistente IA</div>
              <div style={styles.statCard}><div style={styles.statValue}>5</div>Roles</div>
              <div style={styles.statCard}><div style={styles.statValue}>IoT</div>Signos vitales</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.altSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Nuestro equipo</h2>

          <div style={styles.teamGrid}>
            <div style={styles.memberCard}>Dr. Ramírez<br />Jefe de área</div>
            <div style={styles.memberCard}>Dra. García<br />Ginecología</div>
            <div style={styles.memberCard}>Dr. López<br />Obstetricia</div>
            <div style={styles.memberCard}>Enf. Martínez<br />Enfermera</div>
            <div style={styles.memberCard}>Asist. Sánchez<br />Asistente</div>
          </div>
        </div>
      </section>

      <section id="contacto" style={styles.cta}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>¿Lista para cuidar tu salud?</h2>
          <p style={styles.sectionText}>Crea tu cuenta gratis y agenda tu primera cita hoy mismo.</p>

          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={irRegistro}>Registrarme ahora</button>
            <button style={styles.outlineButton} onClick={irLogin}>Iniciar sesión</button>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>© 2026 GineSys. Todos los derechos reservados.</div>

          <div style={styles.footerLinks}>
            <span>Aviso de privacidad</span>
            <span>Términos de uso</span>
            <span>Contacto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;