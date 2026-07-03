<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Cita;
use App\Models\Usuario;
use App\Models\ExpedienteClinico;
use App\Models\ConsultaMedica;
use App\Models\Diagnostico;
use App\Models\Receta;
use App\Models\MedicamentoReceta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    public function index()
    {
        $doctores = Doctor::where('activo', 1)->get();

        $data = $doctores->map(function ($d) {
            return [
                "id_doctor" => $d->id_doctor,
                "nombre" => $d->nombres . " " . $d->apellido_paterno . " " . $d->apellido_materno,
                "cedula_profesional" => $d->cedula_profesional,
                "telefono" => $d->telefono,
                "id_especialidad" => $d->id_especialidad,
            ];
        });

        return response()->json([
            "doctores" => $data
        ]);
    }

    /**
     * GET /api/doctores/disponibles?id_especialidad=&fecha_hora=
     * Filtra doctores activos por especialidad y, si se manda fecha_hora,
     * excluye a los que ya tienen una cita dentro de ±30 min de esa hora.
     */
    public function disponibles(Request $request)
    {
        $idEspecialidad = $request->query('id_especialidad');
        $fechaHora = $request->query('fecha_hora');

        $query = Doctor::where('activo', 1);

        if ($idEspecialidad) {
            $query->where('id_especialidad', $idEspecialidad);
        }

        $doctores = $query->get();

        if ($fechaHora) {
            $momento = \Carbon\Carbon::parse($fechaHora);
            $inicio = $momento->copy()->subMinutes(30);
            $fin = $momento->copy()->addMinutes(30);

            $doctores = $doctores->filter(function ($d) use ($inicio, $fin) {
                $ocupado = Cita::where('id_doctor', $d->id_doctor)
                    ->whereIn('estado', ['programada', 'confirmada', 'en_curso'])
                    ->whereBetween('fecha_hora', [$inicio, $fin])
                    ->exists();
                return !$ocupado;
            })->values();
        }

        $data = $doctores->map(function ($d) {
            return [
                "id_doctor" => $d->id_doctor,
                "nombre" => $d->nombres . " " . $d->apellido_paterno . " " . $d->apellido_materno,
                "cedula_profesional" => $d->cedula_profesional,
                "telefono" => $d->telefono,
                "id_especialidad" => $d->id_especialidad,
            ];
        });

        return response()->json([
            "doctores" => $data
        ]);
    }

    private function doctorAutenticado(Request $request)
    {
        $idUsuario = $request->header('X-Usuario-Id');

        if (!$idUsuario) {
            return null;
        }

        return Doctor::where('id_usuario', $idUsuario)->first();
    }

    public function dashboard(Request $request)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $hoy = now()->toDateString();

        $todayAppointments = Cita::where('id_doctor', $doctor->id_doctor)
            ->whereDate('fecha_hora', $hoy)
            ->count();

        $pendingPatients = Cita::where('id_doctor', $doctor->id_doctor)
            ->where('estado', 'programada')
            ->count();

        $completedConsultations = Cita::where('id_doctor', $doctor->id_doctor)
            ->where('estado', 'completada')
            ->count();

        // Trae todas las citas del doctor (sin filtrar por fecha), ordenadas
        // de la más próxima/antigua a la más lejana.
        $nextAppointments = Cita::with('paciente')
            ->where('id_doctor', $doctor->id_doctor)
            ->orderBy('fecha_hora', 'asc')
            ->take(5)
            ->get()
            ->map(function ($cita) {
                return [
                    'id' => $cita->id_cita,
                    'patientName' => $cita->paciente
                        ? trim($cita->paciente->nombres . ' ' . $cita->paciente->apellido_paterno)
                        : 'Paciente',
                    'reason' => $cita->motivo_consulta,
                    'date' => \Carbon\Carbon::parse($cita->fecha_hora)->format('d/m/Y'),
                    'time' => \Carbon\Carbon::parse($cita->fecha_hora)->format('h:i A'),
                    'status' => $cita->estado ?? 'programada',
                    'statusLabel' => $this->etiquetaEstado($cita->estado),
                ];
            });

        $recentPatients = Cita::with('paciente')
            ->where('id_doctor', $doctor->id_doctor)
            ->orderBy('fecha_hora', 'desc')
            ->take(5)
            ->get()
            ->pluck('paciente')
            ->filter()
            ->unique('id_paciente')
            ->take(5)
            ->map(function ($paciente) {
                return [
                    'id' => $paciente->id_paciente,
                    'fullName' => trim($paciente->nombres . ' ' . $paciente->apellido_paterno),
                    'lastVisit' => '',
                ];
            })
            ->values();

        return response()->json([
            'doctor' => [
                'nombres' => $doctor->nombres,
                'apellido_paterno' => $doctor->apellido_paterno,
            ],
            'stats' => [
                'todayAppointments' => $todayAppointments,
                'pendingPatients' => $pendingPatients,
                'completedConsultations' => $completedConsultations,
            ],
            'nextAppointments' => $nextAppointments,
            'recentPatients' => $recentPatients,
        ]);
    }

    public function misPacientes(Request $request)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $idsPacientes = Cita::where('id_doctor', $doctor->id_doctor)
            ->distinct()
            ->pluck('id_paciente');

        $query = Paciente::whereIn('id_paciente', $idsPacientes);

        if ($request->filled('search')) {
            $busqueda = $request->search;
            $query->where(function ($q) use ($busqueda) {
                $q->where('nombres', 'like', "%{$busqueda}%")
                  ->orWhere('apellido_paterno', 'like', "%{$busqueda}%")
                  ->orWhere('apellido_materno', 'like', "%{$busqueda}%");
            });
        }

        $pacientes = $query->get()->map(function ($p) use ($doctor) {
            $ultimaCita = Cita::where('id_doctor', $doctor->id_doctor)
                ->where('id_paciente', $p->id_paciente)
                ->orderBy('fecha_hora', 'desc')
                ->first();

            return [
                'id_paciente' => $p->id_paciente,
                'nombres' => $p->nombres,
                'apellido_paterno' => $p->apellido_paterno,
                'apellido_materno' => $p->apellido_materno,
                'correo_contacto' => $p->correo_contacto,
                'telefono' => $p->telefono,
                'ultima_cita' => $ultimaCita
                    ? \Carbon\Carbon::parse($ultimaCita->fecha_hora)->format('d/m/Y')
                    : null,
            ];
        });

        return response()->json(['pacientes' => $pacientes]);
    }

    public function perfil(Request $request)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $usuario = Usuario::find($doctor->id_usuario);

        return response()->json([
            'nombres' => $doctor->nombres,
            'apellido_paterno' => $doctor->apellido_paterno,
            'apellido_materno' => $doctor->apellido_materno,
            'cedula_profesional' => $doctor->cedula_profesional,
            'telefono' => $doctor->telefono,
            'id_especialidad' => $doctor->id_especialidad,
            'correo' => $usuario ? $usuario->correo : '',
        ]);
    }

    public function actualizarPerfil(Request $request)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $validated = $request->validate([
            'nombres' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:15',
            'cedula_profesional' => [
                'required',
                'string',
                'max:30',
                'unique:doctores,cedula_profesional,' . $doctor->id_doctor . ',id_doctor',
            ],
            'id_especialidad' => 'required|exists:especialidades,id_especialidad',
            'correo' => 'required|email|unique:usuarios,correo,' . $doctor->id_usuario . ',id_usuario',
        ]);

        $doctor->update([
            'nombres' => $validated['nombres'],
            'apellido_paterno' => $validated['apellido_paterno'],
            'apellido_materno' => $validated['apellido_materno'] ?? '',
            'telefono' => $validated['telefono'] ?? null,
            'cedula_profesional' => $validated['cedula_profesional'],
            'id_especialidad' => $validated['id_especialidad'],
        ]);

        $usuario = Usuario::find($doctor->id_usuario);
        if ($usuario) {
            $usuario->update(['correo' => $validated['correo']]);
        }

        return response()->json(['message' => 'Perfil actualizado correctamente']);
    }

    public function crearCita(Request $request)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $validated = $request->validate([
            'id_paciente' => 'required|exists:pacientes,id_paciente',
            'fecha_hora' => 'required|date',
            'motivo_consulta' => 'required|string|max:255',
            'observaciones' => 'nullable|string',
        ]);

        $cita = Cita::create([
            'id_paciente' => $validated['id_paciente'],
            'id_doctor' => $doctor->id_doctor,
            'fecha_hora' => $validated['fecha_hora'],
            'motivo_consulta' => $validated['motivo_consulta'],
            'observaciones' => $validated['observaciones'] ?? null,
            'estado' => 'programada',
            'creada_por' => $doctor->id_usuario,
            'fecha_creacion' => now(),
        ]);

        return response()->json([
            'message' => 'Cita agendada correctamente',
            'cita' => $cita,
        ], 201);
    }

    public function actualizarEstadoCita(Request $request, $id)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $validated = $request->validate([
            'estado' => 'required|in:programada,confirmada,en_curso,completada,cancelada,no_asistio',
        ]);

        $cita = Cita::where('id_cita', $id)
            ->where('id_doctor', $doctor->id_doctor)
            ->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $cita->update(['estado' => $validated['estado']]);

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'cita' => $cita,
        ]);
    }

    /**
     * GET /api/patients/{patientId}/clinical-record
     * Arma el expediente clínico completo del paciente:
     * datos básicos, alergias, diagnósticos, consultas y recetas.
     *
     * Seguridad: solo permite verlo si el doctor logueado ha
     * atendido a este paciente en al menos una cita.
     */
    public function expedienteClinico(Request $request, $patientId)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $paciente = Paciente::find($patientId);

        if (!$paciente) {
            return response()->json(['message' => 'Paciente no encontrado'], 404);
        }

        $tieneRelacion = Cita::where('id_doctor', $doctor->id_doctor)
            ->where('id_paciente', $patientId)
            ->exists();

        if (!$tieneRelacion) {
            return response()->json(['message' => 'No tienes acceso a este expediente'], 403);
        }

        $edad = $paciente->fecha_nacimiento
            ? \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age
            : null;

        $patientData = [
            'fullName' => trim($paciente->nombres . ' ' . $paciente->apellido_paterno . ' ' . $paciente->apellido_materno),
            'age' => $edad,
            'gender' => $paciente->genero,
            'phone' => $paciente->telefono,
        ];

        $allergies = [];
        if (!empty($paciente->alergias)) {
            $allergies[] = [
                'id' => 'alergia-' . $paciente->id_paciente,
                'name' => 'Alergias registradas',
                'description' => $paciente->alergias,
            ];
        }

        $expediente = ExpedienteClinico::where('id_paciente', $patientId)->first();

        $consultasQuery = ConsultaMedica::query();
        if ($expediente) {
            $consultasQuery->where('id_expediente', $expediente->id_expediente);
        } else {
            $consultasQuery->whereRaw('1 = 0');
        }

        $consultas = $consultasQuery->orderBy('fecha_consulta', 'desc')->get();

        $consultations = $consultas->map(function ($c) {
            return [
                'id' => $c->id_consulta,
                'reason' => $c->sintomas,
                'notes' => $c->observaciones,
                'date' => $c->fecha_consulta
                    ? \Carbon\Carbon::parse($c->fecha_consulta)->format('d/m/Y')
                    : '',
            ];
        });

        $idsConsultas = $consultas->pluck('id_consulta');

        $diagnoses = Diagnostico::whereIn('id_consulta', $idsConsultas)
            ->orderBy('fecha_registro', 'desc')
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id_diagnostico,
                    'title' => $d->codigo_cie10 ?: 'Diagnóstico',
                    'description' => $d->descripcion,
                    'date' => $d->fecha_registro
                        ? \Carbon\Carbon::parse($d->fecha_registro)->format('d/m/Y')
                        : '',
                ];
            });

        $recetas = Receta::whereIn('id_consulta', $idsConsultas)->get();
        $idsRecetas = $recetas->pluck('id_receta');

        $prescriptions = MedicamentoReceta::whereIn('id_receta', $idsRecetas)
            ->get()
            ->map(function ($m) use ($recetas) {
                $receta = $recetas->firstWhere('id_receta', $m->id_receta);

                return [
                    'id' => $m->id_medicamento_receta,
                    'medicine' => $m->medicamento . ($m->dosis ? ' — ' . $m->dosis : ''),
                    'instructions' => trim(($m->frecuencia ?: '') . ' ' . ($m->instrucciones ?: '')),
                    'date' => $receta && $receta->fecha_emision
                        ? \Carbon\Carbon::parse($receta->fecha_emision)->format('d/m/Y')
                        : '',
                ];
            });

        return response()->json([
            'patient' => $patientData,
            'allergies' => $allergies,
            'diagnoses' => $diagnoses,
            'consultations' => $consultations,
            'prescriptions' => $prescriptions,
            // AQUÍ CONECTA AL BACK BRAY: no existe una tabla de estudios médicos
            // en el esquema actual. Si se agrega, conectar aquí.
            'studies' => [],
        ]);
    }

    /**
     * POST /api/doctor/citas/{citaId}/receta
     * Crea la consulta médica de la cita (si no existe), el diagnóstico,
     * la receta y sus medicamentos. Marca la cita como completada.
     */
    public function crearReceta(Request $request, $citaId)
    {
        $doctor = $this->doctorAutenticado($request);

        if (!$doctor) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $cita = Cita::where('id_cita', $citaId)
            ->where('id_doctor', $doctor->id_doctor)
            ->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $validated = $request->validate([
            'diagnostico' => 'required|string',
            'medicamentos' => 'required|array|min:1',
            'medicamentos.*.nombre' => 'required|string|max:150',
            'medicamentos.*.dosis' => 'required|string|max:100',
            'medicamentos.*.frecuencia' => 'required|string|max:100',
            'medicamentos.*.duracion' => 'required|string|max:100',
            'medicamentos.*.indicaciones' => 'nullable|string',
        ]);

        // El paciente necesita un expediente clínico para poder registrar
        // la consulta. Si no tiene, se crea uno vacío en este momento.
        $expediente = ExpedienteClinico::firstOrCreate(
            ['id_paciente' => $cita->id_paciente],
            [
                'numero_expediente' => 'EXP-' . $cita->id_paciente,
                'activo' => 1,
                'fecha_creacion' => now(),
            ]
        );

        $consulta = ConsultaMedica::create([
            'id_cita' => $cita->id_cita,
            'id_doctor' => $doctor->id_doctor,
            'id_expediente' => $expediente->id_expediente,
            'sintomas' => $cita->motivo_consulta,
            'observaciones' => null,
            'fecha_consulta' => now(),
        ]);

        Diagnostico::create([
            'id_consulta' => $consulta->id_consulta,
            'descripcion' => $validated['diagnostico'],
            'fecha_registro' => now(),
        ]);

        $receta = Receta::create([
            'id_consulta' => $consulta->id_consulta,
            'indicaciones_generales' => null,
            'fecha_emision' => now(),
            'activa' => 1,
        ]);

        foreach ($validated['medicamentos'] as $med) {
            MedicamentoReceta::create([
                'id_receta' => $receta->id_receta,
                'medicamento' => $med['nombre'],
                'dosis' => $med['dosis'],
                'frecuencia' => $med['frecuencia'],
                'duracion' => $med['duracion'],
                'instrucciones' => $med['indicaciones'] ?? null,
            ]);
        }

        $cita->update(['estado' => 'completada']);

        return response()->json([
            'message' => 'Receta guardada correctamente',
            'id_receta' => $receta->id_receta,
        ], 201);
    }

    private function etiquetaEstado($estado)
    {
        return match ($estado) {
            'confirmada' => 'Confirmada',
            'en_curso' => 'En curso',
            'completada' => 'Finalizada',
            'cancelada' => 'Cancelada',
            'no_asistio' => 'No asistió',
            default => 'Programada',
        };
    }
}