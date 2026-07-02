import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: "📊",
    path: "/doctor",
  },
  {
    label: "Pacientes",
    icon: "👥",
    path: "/paciente",
  },
  {
    label: "Agendar cita",
    icon: "📅",
    path: "/doctor/agenda",
  },
  {
    label: "Expedientes",
    icon: "📁",
    path: "/doctor/expediente",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">❤</span>
        <span>GineSys</span>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-avatar">AS</div>

        <div>
          <strong>Asist. Sánchez</strong>
          <span>Asistente</span>
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
    </aside>
  );
}

export default Sidebar;
