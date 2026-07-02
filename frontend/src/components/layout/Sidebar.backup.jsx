import React from 'react';


const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pacientes', label: 'Pacientes', icon: '👥', active: true },
    { id: 'citas', label: 'Agendar cita', icon: '📅' },
    { id: 'expedientes', label: 'Expedientes', icon: '📁' },
  ];

  return (
        <aside className={`sidebar-wrapper ${isOpen ? 'open' : ''}`} style={styles.sidebarColors}>
      
      {/* LOGO Y USUARIO */}
      <div style={styles.header}>
        <h2 style={styles.logo}>❤️ GineSys</h2>
        <div style={styles.userCard}>
          <div style={styles.avatar}>AS</div>
          <div>
            <p style={styles.userName}>Asist. Sánchez</p>
            <p style={styles.userRole}>Asistente</p>
          </div>
        </div>
      </div>

      {/* LISTA DE NAVEGACIÓN */}
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            style={{
              ...styles.menuItem,
              ...(item.active ? styles.menuItemActive : {})
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

    </aside>
  );
};

const styles = {
  sidebarColors: {
    backgroundColor: '#fcfbf9',
  },
  header: { marginBottom: '30px' },
  logo: { fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
  userCard: { display: 'flex', alignItems: 'center', backgroundColor: '#f2eee8', padding: '10px', borderRadius: '8px', gap: '10px' },
  avatar: { backgroundColor: '#d4cec5', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: '#333' },
  userName: { fontSize: '14px', fontWeight: 'bold', margin: 0 },
  userRole: { fontSize: '12px', color: '#666', margin: 0 },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  menuItem: { display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', color: '#555', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s' },
  menuItemActive: { backgroundColor: '#fce4ec', color: '#d81b60', fontWeight: 'bold' },
  icon: { marginRight: '10px', fontSize: '18px' }
};

export default Sidebar;