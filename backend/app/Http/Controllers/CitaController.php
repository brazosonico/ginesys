<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\ConsultaMedica;
use App\Models\Diagnostico;
use App\Models\Receta;
use App\Models\MedicamentoReceta;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CitaController extends Controller
{
    // 🔹 LISTAR CITAS POR USUARIO
    public function index(Request $request)
    {
        $idUsuario = $request->query('id_usuario');
        $tipoUsuario = $request->query('tipo_usuario', 'paciente');

        if (!$idUsuario) {
            return response()->json(['message' => 'Falta id_usuario'], 400);
        }

        $query = Cita::with(['paciente', 'doctor.especialidad']);

        if ($tipoUsuario === 'doctor') {
            $doctor = Doctor::where('id_usuario', $idUsuario)->first();
            if (!$doctor) {
                return response()->json(['citas' => []]);
            }
            $query->where('id_doctor', $doctor->id_doctor);
        } else {
            $paciente = Paciente::where('id_usuario', $idUsuario)->first();
            if (!$paciente) {
                return response()->json(['citas' => []]);
            }
            $query->where('id_paciente', $paciente->id_paciente);
        }

        return response()->json([
            'citas' => $query->orderBy('fecha_hora', 'desc')->get()
        ]);
    }

    // 🔹 CREAR CITA (PACIENTE)
    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|exists:usuarios,id_usuario',
            'id_doctor' => 'required|exists:doctores,id_doctor',
            'fecha_hora' => 'required|date',
            'motivo_consulta' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        // Resolvemos el paciente a partir del usuario logueado,
        // en vez de confiar en un id_paciente mandado desde el frontend.
        $paciente = Paciente::where('id_usuario', $request->id_usuario)->first();

        if (!$paciente) {
            return response()->json([
                'message' => 'No se encontró un paciente asociado a este usuario'
            ], 404);
        }

        // Evita encimar citas: si el doctor ya tiene una cita activa dentro
        // de ±30 min del horario solicitado, se rechaza.
        $momento = Carbon::parse($request->fecha_hora);
        $ocupado = Cita::where('id_doctor', $request->id_doctor)
            ->whereIn('estado', ['programada', 'confirmada', 'en_curso'])
            ->whereBetween('fecha_hora', [$momento->copy()->subMinutes(30), $momento->copy()->addMinutes(30)])
            ->exists();

        if ($ocupado) {
            return response()->json([
                'message' => 'El doctor ya tiene una cita en ese horario. Elige otro horario.'
            ], 409);
        }

      // En store():
$cita = Cita::create([
    'id_paciente' => $paciente->id_paciente,
    'id_doctor' => $request->id_doctor,
    'fecha_hora' => $request->fecha_hora,
    'motivo_consulta' => $request->motivo_consulta,
    'estado' => 'programada',   // 👈 antes 'pendiente'
    'observaciones' => $request->observaciones,
    'creada_por' => $request->id_usuario,
    'fecha_creacion' => Carbon::now(),
]);

        return response()->json([
            'message' => 'Cita creada correctamente',
            'cita' => $cita
        ], 201);
    }

    // 🔹 VER UNA CITA
    public function show($id)
    {
        $cita = Cita::with(['paciente', 'doctor.especialidad'])
            ->where('id_cita', $id)
            ->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        return response()->json($cita);
    }

    // 🔹 ACTUALIZAR CITA
    public function update(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $cita->update([
            'fecha_hora' => $request->fecha_hora ?? $cita->fecha_hora,
            'motivo_consulta' => $request->motivo_consulta ?? $cita->motivo_consulta,
            'estado' => $request->estado ?? $cita->estado,
            'observaciones' => $request->observaciones ?? $cita->observaciones,
        ]);

        return response()->json([
            'message' => 'Cita actualizada',
            'cita' => $cita
        ]);
    }

    // 🔹 CANCELAR CITA
    public function cancelar($id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $cita->update(['estado' => 'cancelada']);

        return response()->json([
            'message' => 'Cita cancelada',
            'cita' => $cita
        ]);
    }

    /**
     * 🔹 VER RECETA DE UNA CITA
     * GET /api/citas/{id}/receta?id_usuario=...
     *
     * Recorre cita -> consulta_medica -> diagnostico + receta -> medicamentos_receta.
     * Si viene id_usuario, valida que la cita le pertenezca a ese paciente
     * antes de mostrar la receta.
     */
    public function receta(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $idUsuario = $request->query('id_usuario');
        if ($idUsuario) {
            $paciente = Paciente::where('id_usuario', $idUsuario)->first();
            if (!$paciente || $paciente->id_paciente !== $cita->id_paciente) {
                return response()->json(['message' => 'No tienes acceso a esta receta'], 403);
            }
        }

        $consulta = ConsultaMedica::where('id_cita', $cita->id_cita)
            ->orderBy('fecha_consulta', 'desc')
            ->first();

        if (!$consulta) {
            return response()->json(['message' => 'Esta cita todavía no tiene una receta'], 404);
        }

        $diagnostico = Diagnostico::where('id_consulta', $consulta->id_consulta)
            ->orderBy('fecha_registro', 'desc')
            ->first();

        $receta = Receta::where('id_consulta', $consulta->id_consulta)
            ->orderBy('fecha_emision', 'desc')
            ->first();

        if (!$receta) {
            return response()->json(['message' => 'Esta cita todavía no tiene una receta'], 404);
        }

        $medicamentos = MedicamentoReceta::where('id_receta', $receta->id_receta)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id_medicamento_receta,
                    'nombre' => $m->medicamento,
                    'dosis' => $m->dosis,
                    'frecuencia' => $m->frecuencia,
                    'duracion' => $m->duracion,
                    'indicaciones' => $m->instrucciones,
                ];
            });

        return response()->json([
            'diagnostico' => $diagnostico->descripcion ?? null,
            'fecha_emision' => $receta->fecha_emision
                ? Carbon::parse($receta->fecha_emision)->format('d/m/Y')
                : null,
            'medicamentos' => $medicamentos,
        ]);
    }

    // 🔹 ELIMINAR (OPCIONAL)
    public function destroy($id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $cita->delete();

        return response()->json([
            'message' => 'Cita eliminada'
        ]);
    }
}