import React from "react";
import { NavLink } from "react-router-dom";

function DoctorNav() {
  return (
    <nav className="doctor-nav">
      <NavLink to="/doctor" end>
        Dashboard
      </NavLink>

      <NavLink to="/doctor/agenda">
        Agenda de citas
      </NavLink>

      <NavLink to="/doctor/expediente">
        Expediente clínico
      </NavLink>
    </nav>
  );
}

export default DoctorNav;
