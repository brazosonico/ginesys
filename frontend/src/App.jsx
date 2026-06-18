import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import PatientProfile from './pages/PatientProfile';

function App() {
  return (
    <DashboardLayout>
      <PatientProfile />
    </DashboardLayout>
  );
}

export default App;