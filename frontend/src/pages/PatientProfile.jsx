import React, { useState, useEffect } from 'react';
import PatientHeader from '../components/patient/PatientHeader';
import PermissionBanner from '../components/patient/PermissionBanner';
import ContactInfo from '../components/patient/ContactInfo';
import NextAppointment from '../components/patient/NextAppointment';

const PatientProfile = () => {
  // 1. Estados para guardar la información del backend
  const [patientData, setPatientData] = useState(null);
  const [userRole, setUserRole] = useState(''); // Puede ser 'asistente', 'doctor', 'jefe'
  const [loading, setLoading] = useState(true);

  // Aquí meterás Laravel después bray)
  useEffect(() => {
    // Simulamos un retraso de red de 1 segundo
    setTimeout(() => {
      const mockApiResponse = {
        role: 'asistente', // Esto vendrá del token o login del usuario activo
        patient: {
          id: '0042',
          fullName: 'María González Herrera',
          phone: '55 1234 5678',
          email: 'maria@email.com',
          assignedDoctor: 'Dra. García',
          specialty: 'Ginecología',
          nextAppointment: {
            title: 'Ginecología — Revisión',
            date: '15 mayo 2026',
            time: '10:30 am',
            location: 'Consultorio 2',
          }
        }
      };

      setPatientData(mockApiResponse.patient);
      setUserRole(mockApiResponse.role);
      setLoading(false);
    }, 1000);
  }, []);

  // 3. Pantalla de carga mientras el backend responde
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando expediente médico...</div>;
  }

  // 4. Renderizado pasándole las variables (props) a los componentes
  return (
    <div>
      <PatientHeader patient={patientData} role={userRole} />
      
      {/* Renderizado condicional: Solo mostramos el banner si es asistente */}
      {userRole === 'asistente' && <PermissionBanner />}
      
      <div className="grid-2-col">
        <ContactInfo patient={patientData} />
        <NextAppointment appointment={patientData.nextAppointment} doctor={patientData.assignedDoctor} />
      </div>
    </div>
  );
};

export default PatientProfile;