import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AgendarCita from "./pages/AgendarCita";
import Perfil from "./pages/Perfil";
import Citas from "./pages/MisCitas";
import DoctorDashboard from "./pages/DoctorDashboard";
import ClinicalRecord from "./pages/ClinicalRecord";
import Pacientes from "./pages/Pacientes";
import PerfilDoctor from "./pages/PerfilDoctor";
import DoctorAgendarCita from "./pages/DoctorAgendarCita";
import DoctorReceta from "./pages/DoctorReceta";
import ChatbotWidget from "./components/ChatbotWidget";
import DashboardLayout from "./layouts/DashboardLayout";
import { isDoctor } from "./utils/auth";

function RequireDoctor({ children }) {
  if (!isDoctor()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔴 PACIENTE (sin sidebar de doctor) */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mis-citas" element={<Citas />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />

        {/* 🔵 MÉDICO (con Sidebar, protegidas) */}
        <Route
          path="/doctor"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <DoctorDashboard />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
        <Route
          path="/doctor/pacientes"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <Pacientes />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
        <Route
          path="/doctor/expediente/:patientId"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <ClinicalRecord />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
        <Route
          path="/doctor/agendar-cita"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <DoctorAgendarCita />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
        <Route
          path="/doctor/citas/:citaId/receta"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <DoctorReceta />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
        <Route
          path="/doctor/perfil"
          element={
            <RequireDoctor>
              <DashboardLayout>
                <PerfilDoctor />
              </DashboardLayout>
            </RequireDoctor>
          }
        />
      </Routes>
      <ChatbotWidget />
    </BrowserRouter>
  );
}

export default App;