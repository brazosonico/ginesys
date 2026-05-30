GineSys v1.0
DESCRIPCIÓN
El proyecto denominado GineSys es un Sistema de Gestión Médica Femenina desarrollado como aplicación web, enfocado en la digitalización de consultorios médicos de especialidades femeninas. Permite administrar expedientes clínicos, citas médicas, monitoreo de signos vitales en tiempo real y asistencia mediante inteligencia artificial, eliminando el uso de expedientes físicos y agendas manuales.

ARQUITECTURA
El proyecto se desarrollará con la arquitectura Cliente-Servidor (MVC), la cual consiste en separar la lógica de presentación (Frontend), la lógica de negocio (Backend) y el almacenamiento de datos (Base de Datos), comunicándose mediante una API REST.
ginesys/
│
├── frontend/         # React + Vite (interfaz de usuario)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│
├── backend/          # Laravel + PHP (API REST)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── routes/
│   └── database/
│
└── README.md

PILA TECNOLÓGICA

LENGUAJE DE PROGRAMACIÓN: JavaScript (Frontend) / PHP (Backend)
BASE DE DATOS: PostgreSQL
VCS: Git Hub — https://github.com/brazosonico/ginesys
FRAMEWORK: React + Vite (Frontend) / Laravel (Backend)
IDE: Visual Studio Code


METODOLOGÍA
El proyecto se desarrollará con la metodología SCRUM, en 4 SPRINTS, en las siguientes fechas:

SPRINT 1: 1 - 12 de junio
SPRINT 2: 15 - 26 de junio
SPRINT 3: 29 de junio - 3 de julio
SPRINT 4: 13 - 23 de julio

Estructura por Sprints
SprintPeriodoObjetivo PrincipalSprint 11 - 12 junConfiguración inicial, Landing Page, Login, Registro, Arquitectura API, AutenticaciónSprint 215 - 26 junDashboards, Agenda de citas, Gestión de usuarios y roles, API de citasSprint 329 jun - 3 julExpediente clínico, Chatbot IA, Reportes y estadísticasSprint 413 - 23 julMonitoreo IoT, Optimización UI/UX, Seguridad, Despliegue a producción

PRINCIPALES FUNCIONALIDADES

FUNCIONALIDAD 1: Registro e inicio de sesión con roles diferenciados (Paciente, Doctor, Enfermera, Asistente, Jefe de Área)
FUNCIONALIDAD 2: Gestión de expedientes clínicos (historial médico, diagnósticos, tratamientos y resultados de estudios)
FUNCIONALIDAD 3: Agenda de citas médicas (crear, editar, cancelar y consultar citas)
FUNCIONALIDAD 4: Chatbot con Inteligencia Artificial para resolución de dudas médicas básicas
FUNCIONALIDAD 5: Monitoreo de signos vitales en tiempo real mediante dispositivos IoT
FUNCIONALIDAD 6: Generación de reportes médicos con gráficas y estadísticas
FUNCIONALIDAD 7: Administración de usuarios y control de acceso por roles


EQUIPO DE TRABAJO

SM (Scrum Master): Manuel Alejandro Salinas López
DESARROLLADOR 1: Karen García Vega
DESARROLLADOR 2: Brayan Cerón Díaz
DESARROLLADOR 3: Luis Fernando Gómez Pérez
DESARROLLADOR 4: Alejandro Agustín González Campos

Equipo: Vision Devs
Universidad Tecnológica de Nezahualcóyotl
Materia: Administración de Proyectos
