import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Vistas de Autenticación
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Vistas del Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import PatientProfile from './pages/PatientProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida del Dashboard (Envuelve el perfil en el layout) */}
        <Route 
          path="/paciente" 
          element={
            <DashboardLayout>
              <PatientProfile />
            </DashboardLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;