import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClinicalRecord } from "../services/doctorService";
import "../styles/doctorPages.css";

const initialRecord = {
  patient: null,
  allergies: [],
  diagnoses: [],
  consultations: [],
  prescriptions: [],
  studies: [],
};

function ClinicalRecord() {
  const { patientId } = useParams();

  const [record, setRecord] = useState(initialRecord);
  const [loading, setLoading] = useState(Boolean(patientId));
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    async function loadClinicalRecord() {
      try {
        const data = await getClinicalRecord(patientId);

        setRecord({
          patient: data.patient || null,
          allergies: data.allergies || [],
          diagnoses: data.diagnoses || [],
          consultations: data.consultations || [],
          prescriptions: data.prescriptions || [],
          studies: data.studies || [],
        });

        setBackendMessage("");
      } catch (error) {
        setRecord(initialRecord);
        setBackendMessage(
          "No se pudo cargar el expediente clínico. Intenta de nuevo en unos momentos."
        );
      } finally {
        setLoading(false);
      }
    }

    loadClinicalRecord();
  }, [patientId]);

  if (!patientId) {
    return (
      <section className="doctor-page">

        <header className="doctor-page-header">
          <div>
            <h1>Expediente clínico</h1>
            <p>
              Selecciona un paciente desde la lista médica o desde la agenda para consultar su expediente.
            </p>
          </div>
        </header>

        <div className="doctor-empty">
          Selecciona un paciente para ver su expediente clínico.
        </div>
      </section>
    );
  }

  return (
    <section className="doctor-page">

      <header className="doctor-page-header">
        <div>
          <h1>Expediente clínico</h1>
          <p>
            Información médica del paciente, consultas, diagnósticos y tratamientos.
          </p>
        </div>
      </header>

      {backendMessage && (
        <div className="doctor-empty">
          {backendMessage}
        </div>
      )}

      {loading ? (
        <div className="doctor-empty">Cargando expediente clínico...</div>
      ) : (
        <div className="clinical-section">
          <article className="doctor-card">
            <h2>Datos del paciente</h2>

            {record.patient ? (
              <div className="clinical-info-grid">
                <div className="clinical-info-box">
                  <span>Nombre</span>
                  <strong>{record.patient.fullName}</strong>
                </div>

                <div className="clinical-info-box">
                  <span>Edad</span>
                  <strong>{record.patient.age}</strong>
                </div>

                <div className="clinical-info-box">
                  <span>Sexo</span>
                  <strong>{record.patient.gender || "No especificado"}</strong>
                </div>

                <div className="clinical-info-box">
                  <span>Teléfono</span>
                  <strong>{record.patient.phone}</strong>
                </div>
              </div>
            ) : (
              <div className="doctor-empty">
                No se encontró información del paciente.
              </div>
            )}
          </article>

          <article className="doctor-card">
            <h2>Alergias</h2>

            {record.allergies.length === 0 ? (
              <div className="doctor-empty">
                No hay alergias registradas.
              </div>
            ) : (
              <div className="doctor-list">
                {record.allergies.map((allergy) => (
                  <div className="doctor-list-item" key={allergy.id}>
                    <div>
                      <h4>{allergy.name}</h4>
                      <p>{allergy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="doctor-card">
            <h2>Diagnósticos</h2>

            {record.diagnoses.length === 0 ? (
              <div className="doctor-empty">
                No hay diagnósticos registrados.
              </div>
            ) : (
              <div className="doctor-list">
                {record.diagnoses.map((diagnosis) => (
                  <div className="doctor-list-item" key={diagnosis.id}>
                    <div>
                      <h4>{diagnosis.title}</h4>
                      <p>{diagnosis.description}</p>
                      <p>{diagnosis.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="doctor-card">
            <h2>Consultas</h2>

            {record.consultations.length === 0 ? (
              <div className="doctor-empty">
                No hay consultas registradas.
              </div>
            ) : (
              <div className="doctor-list">
                {record.consultations.map((consultation) => (
                  <div className="doctor-list-item" key={consultation.id}>
                    <div>
                      <h4>{consultation.reason}</h4>
                      <p>{consultation.notes}</p>
                      <p>{consultation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="doctor-card">
            <h2>Recetas y tratamientos</h2>

            {record.prescriptions.length === 0 ? (
              <div className="doctor-empty">
                No hay recetas registradas.
              </div>
            ) : (
              <div className="doctor-list">
                {record.prescriptions.map((prescription) => (
                  <div className="doctor-list-item" key={prescription.id}>
                    <div>
                      <h4>{prescription.medicine}</h4>
                      <p>{prescription.instructions}</p>
                      <p>{prescription.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="doctor-card">
            <h2>Estudios médicos</h2>

            {record.studies.length === 0 ? (
              <div className="doctor-empty">
                No hay estudios registrados.
              </div>
            ) : (
              <div className="doctor-list">
                {record.studies.map((study) => (
                  <div className="doctor-list-item" key={study.id}>
                    <div>
                      <h4>{study.name}</h4>
                      <p>{study.result}</p>
                      <p>{study.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  );
}

export default ClinicalRecord;