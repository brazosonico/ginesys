import React from 'react';

const PermissionBanner = () => {
  return (
    <div style={styles.banner}>
      {/* Icono de candado y texto de permisos */}
      <div style={styles.leftSection}>
        <span style={styles.icon}>🔒</span>
        <p style={styles.text}>
          Como <strong>Asistente</strong> solo tienes acceso a <strong>datos de contacto y gestión de citas.</strong>
        </p>
      </div>

      {/* Mensaje de confidencialidad a la derecha */}
      <p style={styles.confidentialText}>
        La información clínica es confidencial y solo visible para el personal médico.
      </p>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#fff3e0', // Color crema/naranja muy suave
    border: '1px solid #ffcc80', // Borde sutil
    borderRadius: '12px',
    padding: '15px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '20px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '18px',
  },
  text: {
    margin: 0,
    fontSize: '14px',
    color: '#b78103', // Tono café/naranja oscuro para el texto
    lineHeight: '1.4',
  },
  confidentialText: {
    margin: 0,
    fontSize: '13px',
    color: '#b78103',
    maxWidth: '380px',
    textAlign: 'right',
    fontWeight: '500',
  },
};

export default PermissionBanner;