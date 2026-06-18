import React from 'react';

const NextAppointment = ({ appointment, doctor }) => {
  // Si no hay cita programada, mostramos un mensaje alternativo
  if (!appointment) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>PRÓXIMA CITA</h3>
        <p>No hay citas programadas.</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>PRÓXIMA CITA</h3>
      
      <div style={styles.appointmentBox}>
        <h4 style={styles.appointmentTitle}>{appointment.title}</h4>
        <p style={styles.appointmentDetails}>{appointment.date} · {appointment.time}</p>
        <p style={styles.appointmentDetails}>{appointment.location} · {doctor}</p>
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.btnSecondary}>Reagendar</button>
        <button style={styles.btnDanger}>Cancelar</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    border: '1px solid #eaeaea',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '13px',
    color: '#888',
    letterSpacing: '0.5px',
    marginBottom: '20px',
    marginTop: 0,
  },
  appointmentBox: {
    backgroundColor: '#fce4ec', // Fondo rosado suave
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  appointmentTitle: {
    color: '#880e4f', // Texto rosa muy oscuro
    margin: '0 0 8px 0',
    fontSize: '16px',
  },
  appointmentDetails: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    color: '#555',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto', // Esto empuja los botones hacia abajo si la tarjeta crece
  },
  btnSecondary: {
    flex: 1, // Hace que el botón ocupe la mitad del espacio
    padding: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333',
  },
  btnDanger: {
    flex: 1, // Hace que el botón ocupe la otra mitad
    padding: '10px',
    backgroundColor: '#fff',
    border: '1px solid #d32f2f', // Borde rojo
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#d32f2f', // Texto rojo
  }
};

export default NextAppointment;