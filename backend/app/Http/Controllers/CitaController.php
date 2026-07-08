<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Usuario;
use App\Models\ConsultaMedica;
use App\Models\Diagnostico;
use App\Models\Receta;
use App\Models\MedicamentoReceta;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CitaController extends Controller
{
    /**
     * Determina si el usuario autenticado (paciente o doctor) es dueño
     * de esta cita. Se usa para bloquear IDOR: sin esto, cualquiera con
     * un folio podia ver/editar/cancelar la cita de otra persona.
     */
    private function usuarioEsDuenoDeCita(Cita $cita, Usuario $usuario): bool
    {
        $paciente = Paciente::where('id_usuario', $usuario->id_usuario)->first();
        if ($paciente && $paciente->id_paciente === $cita->id_paciente) {
            return true;
        }

        $doctor = Doctor::where('id_usuario', $usuario->id_usuario)->first();
        if ($doctor && $doctor->id_doctor === $cita->id_doctor) {
            return true;
        }

        return false;
    }

    // 🔹 LISTAR CITAS DEL USUARIO AUTENTICADO
    public function index(Request $request)
    {
        $usuario = $request->user();
        $tipoUsuario = $request->query('tipo_usuario', 'paciente');

        $query = Cita::with(['paciente', 'doctor.especialidad']);

        if ($tipoUsuario === 'doctor') {
            $doctor = Doctor::where('id_usuario', $usuario->id_usuario)->first();
            if (!$doctor) {
                return response()->json(['citas' => []]);
            }
            $query->where('id_doctor', $doctor->id_doctor);
        } else {
            $paciente = Paciente::where('id_usuario', $usuario->id_usuario)->first();
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
            'id_doctor' => 'required|exists:doctores,id_doctor',
            'fecha_hora' => 'required|date',
            'motivo_consulta' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $usuario = $request->user();

        // El paciente y el "creada_por" salen del usuario autenticado
        // por el token, nunca de un campo que mande el cliente.
        $paciente = Paciente::where('id_usuario', $usuario->id_usuario)->first();

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

        $cita = Cita::create([
            'id_paciente' => $paciente->id_paciente,
            'id_doctor' => $request->id_doctor,
            'fecha_hora' => $request->fecha_hora,
            'motivo_consulta' => $request->motivo_consulta,
            'estado' => 'programada',
            'observaciones' => $request->observaciones,
            'creada_por' => $usuario->id_usuario,
            'fecha_creacion' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Cita creada correctamente',
            'cita' => $cita
        ], 201);
    }

    // 🔹 VER UNA CITA (solo el paciente o doctor dueño de la cita)
    public function show(Request $request, $id)
    {
        $cita = Cita::with(['paciente', 'doctor.especialidad'])
            ->where('id_cita', $id)
            ->first();

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if (!$this->usuarioEsDuenoDeCita($cita, $request->user())) {
            return response()->json(['message' => 'No tienes acceso a esta cita'], 403);
        }

        return response()->json($cita);
    }

    // 🔹 ACTUALIZAR CITA (solo el paciente o doctor dueño de la cita)
    public function update(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if (!$this->usuarioEsDuenoDeCita($cita, $request->user())) {
            return response()->json(['message' => 'No tienes acceso a esta cita'], 403);
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

    // 🔹 CANCELAR CITA (solo el paciente o doctor dueño de la cita)
    public function cancelar(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if (!$this->usuarioEsDuenoDeCita($cita, $request->user())) {
            return response()->json(['message' => 'No tienes acceso a esta cita'], 403);
        }

        $cita->update(['estado' => 'cancelada']);

        return response()->json([
            'message' => 'Cita cancelada',
            'cita' => $cita
        ]);
    }

    /**
     * 🔹 VER RECETA DE UNA CITA
     * GET /api/citas/{id}/receta
     *
     * Recorre cita -> consulta_medica -> diagnostico + receta -> medicamentos_receta.
     * Valida con el usuario autenticado que la cita le pertenezca antes de
     * mostrar la receta.
     */
    public function receta(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if (!$this->usuarioEsDuenoDeCita($cita, $request->user())) {
            return response()->json(['message' => 'No tienes acceso a esta receta'], 403);
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

    // 🔹 ELIMINAR (solo el paciente o doctor dueño de la cita)
    public function destroy(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if (!$this->usuarioEsDuenoDeCita($cita, $request->user())) {
            return response()->json(['message' => 'No tienes acceso a esta cita'], 403);
        }

        $cita->delete();

        return response()->json([
            'message' => 'Cita eliminada'
        ]);
    }
}