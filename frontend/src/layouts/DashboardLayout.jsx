import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      
      {/* BARRA SUPERIOR MÓVIL (Solo visible en celular por el CSS) */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn" 
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
        <h2>🩷 GineSys</h2>
      </div>

      {/* FONDO OSCURO (Se muestra si el menú está abierto) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)} // Si tocas lo oscuro, se cierra
        ></div>
      )}

      {/* Le pasamos al Sidebar la orden de si debe estar abierto o no */}
      <Sidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;