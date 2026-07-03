import React from "react";
import { NavLink } from "react-router-dom";
import { getUsuario, logout } from "../../utils/auth";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/doctor" },
  { label: "Pacientes", icon: "👥", path: "/doctor/pacientes" },
  { label: "Agendar cita", icon: "📅", path: "/doctor/agendar-cita" },
  { label: "Mi perfil", icon: "🩺", path: "/doctor/perfil" },
];

function Sidebar({ isOpen }) {
  const usuario = getUsuario();
  const nombreCompleto = usuario
    ? `${usuario.nombres || ""} ${usuario.apellido_paterno || ""}`.trim()
    : "Doctor";
  const iniciales = nombreCompleto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">❤</span>
        <span>GineSys</span>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-avatar">{iniciales || "DR"}</div>
        <div>
          <strong>{nombreCompleto || "Doctor"}</strong>
          <span>Doctor</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/doctor"}
            className={({ isActive }) =>
              isActive ? "sidebar-menu-item active" : "sidebar-menu-item"
            }
          >
            <span className="sidebar-menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        🚪 Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;