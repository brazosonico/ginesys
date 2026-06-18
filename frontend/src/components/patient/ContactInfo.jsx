import React from 'react';

const ContactInfo = ({ patient }) => {
  // Ahora los valores vienen de la base de datos
  const contactData = [
    { label: 'Nombre completo', value: patient.fullName, bold: true },
    { label: 'Paciente #', value: `#${patient.id}`, bold: true },
    { label: 'Teléfono', value: patient.phone, bold: true },
    { label: 'Correo', value: patient.email, bold: true },
    { label: 'Médico asignado', value: patient.assignedDoctor, isLink: true },
    { label: 'Especialidad', value: patient.specialty, bold: true },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>DATOS DE CONTACTO</h3>
      <div style={styles.list}>
        {contactData.map((item, index) => (
          <div key={index} style={styles.row}>
            <span style={styles.label}>{item.label}</span>
            <span style={{
              ...styles.value,
              fontWeight: item.bold ? 'bold' : 'normal',
              color: item.isLink ? '#d81b60' : '#333',
            }}>
              {item.value}
            </span>
          </div>
        ))}
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
  },
  title: {
    fontSize: '13px',
    color: '#888',
    letterSpacing: '0.5px',
    marginBottom: '20px',
    marginTop: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed #eee', // Línea punteada sutil
    paddingBottom: '8px',
  },
  label: {
    color: '#666',
    fontSize: '14px',
  },
  value: {
    fontSize: '14px',
  }
};

export default ContactInfo;