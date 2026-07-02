import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Vistas de Autenticación
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Vistas del Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import PatientProfile from './pages/PatientProfile';

// Vistas del Médico
import DoctorDashboard from "./pages/DoctorDashboard";
import AppointmentsAgenda from "./pages/AppointmentsAgenda";
import ClinicalRecord from "./pages/ClinicalRecord";

// Asistente IA (chatbot flotante, visible en toda la app)
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida del Dashboard del paciente */}
        <Route
          path="/paciente"
          element={
            <DashboardLayout>
              <PatientProfile />
            </DashboardLayout>
          }
        />

        {/* Rutas del médico */}
        <Route
          path="/doctor"
          element={
            <DashboardLayout>
              <DoctorDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/doctor/agenda"
          element={
            <DashboardLayout>
              <AppointmentsAgenda />
            </DashboardLayout>
          }
        />

        <Route
          path="/doctor/expediente"
          element={
            <DashboardLayout>
              <ClinicalRecord />
            </DashboardLayout>
          }
        />

        <Route
          path="/doctor/expediente/:patientId"
          element={
            <DashboardLayout>
              <ClinicalRecord />
            </DashboardLayout>
          }
        />
      </Routes>

      <ChatbotWidget />
    </BrowserRouter>
  );
}

export default App;