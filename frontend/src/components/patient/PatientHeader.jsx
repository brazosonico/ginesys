import React from 'react';

// Recibimos los props en los paréntesis
const PatientHeader = ({ patient, role }) => {
  // Función para obtener iniciales (ej. María González -> MG)
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={styles.card}>
      <div style={styles.infoSection}>
        <div style={styles.avatar}>{getInitials(patient.fullName)}</div>
        <div>
          {/* Usamos las variables del backend */}
          <h1 style={styles.name}>{patient.fullName}</h1>
          <p style={styles.details}>
            Paciente #{patient.id} · Médico: <strong>{patient.assignedDoctor}</strong>
          </p>
        </div>
      </div>

      <div style={styles.actionSection}>
        <div style={styles.badgeContainer}>
           <span style={styles.roleBadge}>
             {role === 'asistente' ? '👩‍⚕️ Vista Asistente' : '🩺 Vista Médica'}
           </span>
        </div>
        <button style={styles.primaryButton}>📅 Agendar cita</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)', // Sombra muy sutil
    border: '1px solid #eaeaea',
    marginBottom: '20px',
  },
  infoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    backgroundColor: '#f3e5f5', // Morado clarito
    color: '#8e24aa', // Morado oscuro
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  name: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  details: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  actionSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  badgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  roleBadge: {
    backgroundColor: '#f5f5f5',
    color: '#555',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }
};

export default PatientHeader;