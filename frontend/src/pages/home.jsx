import { useState, useEffect, useRef } from "react";
import { styles } from "../styles/homeStyles";
import logo from "../assets/logo.png";
import AgendarCita from "./AgendarCita";

/**
 * ─────────────────────────────────────────────────────────────
 * AUTENTICACIÓN (según tu Login.jsx real):
 *
 *  - Tras el login se guarda en localStorage:
 *      localStorage.setItem("usuario", JSON.stringify(data.usuario));
 *      localStorage.setItem("tipo_usuario", data.tipo_usuario); // "paciente" | "doctor"
 *
 *  - No se guarda token: tu backend usa sesión/cookie (Sanctum SPA
 *    o sesión de Laravel), así que las peticiones deben ir con
 *    `credentials: "include"` en vez de un header Authorization.
 *
 *  - El objeto `usuario` viene del modelo Usuario (fillable):
 *    username, correo, id_rol, activo. Uso `usuario.username`
 *    para el saludo; si tu API también manda `nombre`/`name`,
 *    cámbialo abajo por ese campo.
 * ─────────────────────────────────────────────────────────────
 */

// URL base de tu API. Ajusta si usas otro puerto/dominio o un .env (VITE_API_URL).
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000/api";

// Estilos locales para las piezas nuevas (usuario, avatar, dropdown).
// Si prefieres centralizarlos en homeStyles.js, muévelos ahí tal cual.
const userStyles = {
  userMenuWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "transparent",
    border: "1px solid #f3d4e0",
    borderRadius: "999px",
    padding: "6px 14px 6px 6px",
    cursor: "pointer",
  },
  avatarCircle: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#e91e63",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "14px",
    flexShrink: 0,
  },
  userName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
    maxWidth: "140px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    minWidth: "200px",
    padding: "8px",
    zIndex: 50,
  },
  dropdownHeader: {
    padding: "8px 10px",
    borderBottom: "1px solid #f0f0f0",
    marginBottom: "6px",
  },
  dropdownHeaderName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#222",
  },
  dropdownHeaderEmail: {
    fontSize: "12px",
    color: "#888",
  },
  dropdownItem: {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
  },
  dropdownItemDanger: {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#e53935",
    cursor: "pointer",
    fontWeight: 500,
  },
  mobileUserBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderBottom: "1px solid #f0f0f0",
    marginBottom: "6px",
  },
  skeletonCard: {
    background: "#f5f5f5",
    borderRadius: "12px",
    height: "120px",
    animation: "pulse 1.5s infinite ease-in-out",
  },
  emptyText: {
    color: "#888",
    fontSize: "14px",
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "20px 0",
  },
};

// Textos personalizados según el rol del usuario
const CONTENIDO_POR_ROL = {
  paciente: {
    saludoExtra: "¿Cómo te sientes hoy?",
    ctaPrincipal: "Agendar una cita",
    ctaPrincipalHref: "/agendar-cita",
    ctaSecundario: "Ver mis citas",
    ctaSecundarioHref: "/mis-citas",
  },
  doctor: {
    saludoExtra: "Esto es lo que tienes agendado hoy.",
    ctaPrincipal: "Ver mi agenda",
    ctaPrincipalHref: "/mis-citas",
    ctaSecundario: "Mis pacientes",
    ctaSecundarioHref: "/doctor/pacientes",
  },
  admin: {
    saludoExtra: "Panel de administración disponible.",
    ctaPrincipal: "Ir al panel admin",
    ctaPrincipalHref: "/admin",
    ctaSecundario: "Gestionar usuarios",
    ctaSecundarioHref: "/admin/usuarios",
  },
};

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const dropdownRef = useRef(null);

  // ── Datos dinámicos (antes hardcodeados) ─────────────────────
  const [especialidades, setEspecialidades] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargandoEspecialidades, setCargandoEspecialidades] = useState(true);
  const [cargandoEquipo, setCargandoEquipo] = useState(true);
  const [errorEspecialidades, setErrorEspecialidades] = useState(false);
  const [errorEquipo, setErrorEquipo] = useState(false);

  // Cargar usuario logueado desde localStorage (claves reales de Login.jsx)
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedRol = localStorage.getItem("tipo_usuario");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setRol(storedRol);
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Traer especialidades activas desde la tabla `especialidades`
  useEffect(() => {
    const controller = new AbortController();

    async function cargarEspecialidades() {
      setCargandoEspecialidades(true);
      setErrorEspecialidades(false);
      try {
        const res = await fetch(`${API_URL}/especialidades`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("No se pudieron cargar las especialidades");
        const data = await res.json();
        // El backend devuelve { especialidades: [...] } y ya vienen
        // filtradas por activo=true desde el controlador.
        setEspecialidades(data.especialidades || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setErrorEspecialidades(true);
        }
      } finally {
        setCargandoEspecialidades(false);
      }
    }

    cargarEspecialidades();
    return () => controller.abort();
  }, []);

  // Traer equipo médico. Por ahora tu API solo expone /doctores
  // (routes/api.php no tiene /enfermeras ni /asistentes todavía).
  // Cuando agregues esos endpoints, vuelve a sumarlos aquí con Promise.all.
  useEffect(() => {
    const controller = new AbortController();

    async function cargarEquipo() {
      setCargandoEquipo(true);
      setErrorEquipo(false);
      try {
        const res = await fetch(`${API_URL}/doctores`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("No se pudo cargar el equipo médico");

        const data = await res.json();

        // El backend devuelve { doctores: [...] } y cada doctor ya trae
        // el nombre completo armado en el campo "nombre".
        const normalizado = (data.doctores || []).map((d) => ({
          id: `doc-${d.id_doctor}`,
          nombre: `Dr(a). ${d.nombre}`,
          rol: "Doctor(a)",
        }));

        setEquipo(normalizado);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setErrorEquipo(true);
        }
      } finally {
        setCargandoEquipo(false);
      }
    }

    cargarEquipo();
    return () => controller.abort();
  }, []);

  // Estadísticas de la sección "Nosotros". Si no tienes un endpoint
  // dedicado (ej. /api/estadisticas), las derivamos de lo ya cargado.
  useEffect(() => {
    if (cargandoEspecialidades || cargandoEquipo) return;
    setStats({
      especialidades: especialidades.length,
      equipo: equipo.length,
    });
  }, [cargandoEspecialidades, cargandoEquipo, especialidades, equipo]);

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

  const cerrarSesion = () => {
    // No hay Sanctum/sesión de servidor que invalidar (el login es
    // solo por localStorage), así que basta con limpiar el cliente.
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo_usuario");
    setUser(null);
    setRol(null);
    window.location.href = "/login";
  };

  const links = [
    { texto: "Inicio", id: "#inicio" },
    { texto: "Especialidades", id: "#especialidades" },
    { texto: "¿Cómo funciona?", id: "#como-funciona" },
    { texto: "Nosotros", id: "#nosotros" },
    { texto: "Contacto", id: "#contacto" },
  ];

  const estaLogueado = !!user;
  // Usa "username" (o "nombre"/"name" si tu API llega a mandarlo así)
  const nombreMostrado = user?.username || user?.nombre || user?.name || user?.correo?.split("@")[0] || "";
  const primerNombre = nombreMostrado.split(/[\s._]/)[0] || nombreMostrado;
  const iniciales = nombreMostrado
    ? nombreMostrado
        .split(/[\s._]/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "?"
    : "?";
  const contenidoRol = CONTENIDO_POR_ROL[rol] || CONTENIDO_POR_ROL.paciente;

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

          {estaLogueado ? (
            <div style={userStyles.userMenuWrapper} ref={dropdownRef}>
              <button
                id="btn-user-menu"
                style={userStyles.userButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span style={userStyles.avatarCircle}>{iniciales}</span>
                <span style={userStyles.userName}>Hola, {primerNombre}</span>
              </button>

              {userMenuOpen && (
                <div style={userStyles.dropdown}>
                  <div style={userStyles.dropdownHeader}>
                    <div style={userStyles.dropdownHeaderName}>{nombreMostrado}</div>
                    <div style={userStyles.dropdownHeaderEmail}>{user.correo}</div>
                  </div>
                  <button
                    style={userStyles.dropdownItem}
                    onClick={() => (window.location.href = "/perfil")}
                  >
                    Mi perfil
                  </button>
                  <button
                    style={userStyles.dropdownItem}
                    onClick={() => (window.location.href = "/mis-citas")}
                  >
                    {rol === "doctor" ? "Mi agenda" : "Mis citas"}
                  </button>
                  <button id="btn-logout" style={userStyles.dropdownItemDanger} onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button id="btn-login" name="btn-login" style={styles.outlineButton} onClick={irLogin}>
                Iniciar sesión
              </button>

              <button id="btn-register" name="btn-register" style={styles.primaryButton} onClick={irRegistro}>
                Registrarse
              </button>
            </>
          )}

          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>

          {menuOpen && (
            <div style={styles.mobileDropdown}>
              {estaLogueado && (
                <div style={userStyles.mobileUserBox}>
                  <span style={userStyles.avatarCircle}>{iniciales}</span>
                  <div>
                    <div style={userStyles.dropdownHeaderName}>{nombreMostrado}</div>
                    <div style={userStyles.dropdownHeaderEmail}>{user.correo}</div>
                  </div>
                </div>
              )}

              {links.map((link) => (
                <button key={link.id} style={styles.mobileLink} onClick={() => irSeccion(link.id)}>
                  {link.texto}
                </button>
              ))}

              {estaLogueado ? (
                <>
                  <button style={styles.mobileLink} onClick={() => (window.location.href = "/perfil")}>
                    Mi perfil
                  </button>
                  <button style={styles.mobileLink} onClick={() => (window.location.href = "/mis-citas")}>
                    {rol === "doctor" ? "Mi agenda" : "Mis citas"}
                  </button>
                  <button style={styles.primaryButton} onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button style={styles.outlineButton} onClick={irLogin}>Iniciar sesión</button>
                  <button style={styles.primaryButton} onClick={irRegistro}>Registrarse</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <header id="inicio" style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badge}>Plataforma médica segura y confiable</div>

          {estaLogueado ? (
            <>
              <h1 style={styles.heroTitle}>
                Hola, {primerNombre} 👋
                <span style={styles.pinkText}>{contenidoRol.saludoExtra}</span>
              </h1>

              <p style={styles.heroText}>
                Bienvenida de nuevo a GineSys. Aquí puedes retomar justo donde te quedaste.
              </p>

              <div style={styles.heroActions}>
                <button
                  style={styles.primaryButton}
                  onClick={() => (window.location.href = contenidoRol.ctaPrincipalHref)}
                >
                  {contenidoRol.ctaPrincipal}
                </button>
                <button
                  style={styles.outlineButton}
                  onClick={() => (window.location.href = contenidoRol.ctaSecundarioHref)}
                >
                  {contenidoRol.ctaSecundario}
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>

      <section id="especialidades" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Especialidades</h2>

          <div style={styles.specialtyGrid}>
            {cargandoEspecialidades &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={userStyles.skeletonCard} />
              ))}

            {!cargandoEspecialidades && errorEspecialidades && (
              <p style={userStyles.emptyText}>
                No pudimos cargar las especialidades en este momento.
              </p>
            )}

            {!cargandoEspecialidades && !errorEspecialidades && especialidades.length === 0 && (
              <p style={userStyles.emptyText}>Aún no hay especialidades registradas.</p>
            )}

            {!cargandoEspecialidades &&
              !errorEspecialidades &&
              especialidades.map((esp) => (
                <div key={esp.id_especialidad} style={styles.card}>
                  <h3 style={styles.cardTitle}>{esp.nombre}</h3>
                  <p style={styles.cardText}>{esp.descripcion}</p>
                </div>
              ))}
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
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats ? stats.especialidades : "…"}</div>
                Especialidades
              </div>
              <div style={styles.statCard}><div style={styles.statValue}>24/7</div>Asistente IA</div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{stats ? stats.equipo : "…"}</div>
                Equipo médico
              </div>
              <div style={styles.statCard}><div style={styles.statValue}>IoT</div>Signos vitales</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.altSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Nuestro equipo</h2>

          <div style={styles.teamGrid}>
            {cargandoEquipo &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={userStyles.skeletonCard} />
              ))}

            {!cargandoEquipo && errorEquipo && (
              <p style={userStyles.emptyText}>
                No pudimos cargar el equipo médico en este momento.
              </p>
            )}

            {!cargandoEquipo && !errorEquipo && equipo.length === 0 && (
              <p style={userStyles.emptyText}>Aún no hay miembros de equipo registrados.</p>
            )}

            {!cargandoEquipo &&
              !errorEquipo &&
              equipo.map((miembro) => (
                <div key={miembro.id} style={styles.memberCard}>
                  {miembro.nombre}
                  <br />
                  {miembro.rol}
                </div>
              ))}
          </div>
        </div>
      </section>

      {!estaLogueado && (
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
      )}

      {estaLogueado && (
        <section id="contacto" style={styles.cta}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>¿Necesitas algo más, {primerNombre}?</h2>
            <p style={styles.sectionText}>Nuestro asistente IA está disponible 24/7 para resolver tus dudas.</p>

            <div style={styles.heroActions}>
              <button
                style={styles.primaryButton}
                onClick={() => (window.location.href = contenidoRol.ctaPrincipalHref)}
              >
                {contenidoRol.ctaPrincipal}
              </button>
              <button style={styles.outlineButton} onClick={() => irSeccion("#especialidades")}>
                Ver especialidades
              </button>
            </div>
          </div>
        </section>
      )}

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