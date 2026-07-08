<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Paciente;
use App\Models\Doctor;
use App\Models\Especialidad;
use App\Models\Cita;
use App\Models\ConsultaMedica;
use App\Models\Receta;
use App\Models\MedicamentoReceta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class ChatbotController extends Controller
{
    /**
     * POST /api/chat
     * Header: X-Usuario-Id
     * Body: { message: string, history?: array }
     *
     * Contrato con el frontend: SIEMPRE responde 200 con { reply: string }.
     * Los errores de negocio (falta doctor, hora invalida, etc.) se devuelven
     * como texto conversacional dentro de "reply", NO como 4xx/5xx, para que
     * ChatbotWidget.jsx (que solo espera data.reply) nunca caiga en el catch
     * generico de "Tuve un problema para responder".
     */
    public function reply(Request $request)
    {
        try {
            $mensaje = trim((string) $request->input('message', ''));
            $usuario = $request->user(); // resuelto por el middleware auth:sanctum

            if (!$mensaje) {
                return response()->json(['reply' => 'No recibi ningun mensaje. ¿En que te ayudo?']);
            }

            if (!$usuario) {
                return response()->json([
                    'reply' => 'No pude identificar tu sesion. Por favor vuelve a iniciar sesion e intenta de nuevo.'
                ]);
            }

            $paciente = Paciente::where('id_usuario', $usuario->id_usuario)->first();
            $doctor = Doctor::where('id_usuario', $usuario->id_usuario)->first();
            $esDoctor = (bool) $doctor;

            $texto = $this->normalizar($mensaje);
            $intent = $this->detectarIntencion($texto);

            Log::info('Chatbot: mensaje recibido', [
                'id_usuario' => $usuario->id_usuario,
                'es_doctor' => $esDoctor,
                'intent' => $intent,
                'mensaje' => $mensaje,
            ]);

            switch ($intent) {
                case 'agendar_cita':
                    return $esDoctor
                        ? response()->json(['reply' => $this->agendaComoDoctor($doctor)])
                        : response()->json(['reply' => $this->agendarCita($mensaje, $usuario, $paciente)]);

                case 'ver_citas':
                    return response()->json([
                        'reply' => $esDoctor
                            ? $this->verAgendaDoctor($doctor)
                            : $this->verCitasPaciente($paciente, $usuario)
                    ]);

                case 'tratamiento':
                    return response()->json([
                        'reply' => $esDoctor
                            ? 'Como doctor, revisa el expediente del paciente desde el panel medico para ver o registrar tratamientos.'
                            : $this->verTratamiento($paciente)
                    ]);

                case 'tome_medicamento':
                    return response()->json(['reply' => $this->registrarSeguimiento($paciente)]);

                case 'saludo':
                    return response()->json([
                        'reply' => $esDoctor
                            ? '¡Hola, doctor(a)! Puedo mostrarte tu agenda del dia o tus pacientes asignados. ¿Que necesitas?'
                            : '¡Hola! Soy tu Asistente IA de GineSys. Puedo ayudarte a agendar una cita, ver tus citas o revisar tu tratamiento. ¿En que te apoyo?'
                    ]);

                default:
                    return response()->json([
                        'reply' => $this->respuestaAyuda($esDoctor)
                    ]);
            }
        } catch (\Throwable $e) {
            // Nunca dejar que un 500 llegue al frontend como mensaje generico:
            // se registra el detalle real en el log y se responde algo util.
            Log::error('Chatbot: error inesperado', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'reply' => 'Tuve un problema procesando tu solicitud. El equipo tecnico ya puede revisar el log para ver el detalle exacto.'
            ]);
        }
    }

    // ------------------------------------------------------------------
    // INTENCIONES
    // ------------------------------------------------------------------

    private function detectarIntencion(string $texto): string
    {
        if (preg_match('/\b(hola|buenas|buenos dias|buenas tardes|buenas noches)\b/', $texto)) {
            return 'saludo';
        }
        if (preg_match('/\b(ya tome|tome mi medicamento|tome el medicamento)\b/', $texto)) {
            return 'tome_medicamento';
        }
        if (preg_match('/\b(tratamiento|receta|medicamento|medicamentos)\b/', $texto)) {
            return 'tratamiento';
        }
        if (preg_match('/\b(ver|mostrar|consultar).*(cita|citas|agenda)\b/', $texto)
            || preg_match('/\bmis citas\b/', $texto)
            || preg_match('/\bmi agenda\b/', $texto)) {
            return 'ver_citas';
        }
        if (preg_match('/\b(agendar|agenda|reservar|quiero una cita|necesito una cita|programar)\b.*\bcita\b/', $texto)
            || preg_match('/\bcita\b.*\b(agendar|reservar|programar)\b/', $texto)
            || preg_match('/\bquiero (una )?cita\b/', $texto)) {
            return 'agendar_cita';
        }

        return 'desconocido';
    }

    private function respuestaAyuda(bool $esDoctor): string
    {
        if ($esDoctor) {
            return 'Puedo ayudarte a ver tu agenda del dia o tus pacientes asignados. Prueba con "ver mi agenda".';
        }
        return 'Puedo ayudarte a agendar una cita (ej. "quiero una cita de ginecologia mañana a las 10"), ' .
            'a consultar tus citas ("ver mis citas") o a revisar tu tratamiento ("ver mi tratamiento"). ' .
            '¿Que necesitas?';
    }

    // ------------------------------------------------------------------
    // AGENDAR CITA (PACIENTE)
    // ------------------------------------------------------------------

    private function agendarCita(string $mensajeOriginal, Usuario $usuario, ?Paciente $paciente): string
    {
        if (!$paciente) {
            return 'No encontre un expediente de paciente asociado a tu usuario, asi que no puedo agendar la cita. ' .
                'Contacta a recepcion para completar tu registro.';
        }

        $texto = $this->normalizar($mensajeOriginal);

        // 1) Especialidad -----------------------------------------------------
        $especialidad = $this->extraerEspecialidad($texto);
        if (!$especialidad) {
            $activas = Especialidad::where('activo', 1)->pluck('nombre')->implode(', ');
            return "¿Que especialidad necesitas? Las disponibles son: {$activas}.";
        }

        // 2) Fecha --------------------------------------------------------------
        $fecha = $this->extraerFecha($texto);
        if (!$fecha) {
            return "Entendido, {$especialidad->nombre}. ¿Para que fecha te gustaria la cita? " .
                'Puedes decir "hoy", "mañana" o una fecha como "15 de julio".';
        }

        // 3) Hora -----------------------------------------------------------
        $horaResultado = $this->extraerHora($texto);
        if ($horaResultado === 'ambigua') {
            return 'La hora que diste es ambigua. ¿Es en la mañana o en la tarde/noche? ' .
                'Por ejemplo: "a las 5 de la tarde" o "a las 10 de la mañana".';
        }
        if (!$horaResultado) {
            return "Ya tengo {$especialidad->nombre} para el " . $fecha->format('d/m/Y') .
                '. ¿A que hora te gustaria la cita?';
        }

        [$hora, $minuto] = $horaResultado;
        $fechaHora = $fecha->copy()->setTime($hora, $minuto);

        if ($fechaHora->isPast()) {
            return 'Esa fecha y hora ya pasaron. ¿Podrias darme una fecha y hora futura?';
        }

        // 4) Doctor disponible ------------------------------------------------
        $doctorDisponible = Doctor::where('id_especialidad', $especialidad->id_especialidad)
            ->where('activo', 1)
            ->get()
            ->first(function ($d) use ($fechaHora) {
                return !$this->doctorOcupado($d->id_doctor, $fechaHora);
            });

        if (!$doctorDisponible) {
            $hayDoctorEspecialidad = Doctor::where('id_especialidad', $especialidad->id_especialidad)
                ->where('activo', 1)
                ->exists();

            if (!$hayDoctorEspecialidad) {
                return "Por ahora no hay ningun doctor activo asignado a {$especialidad->nombre}. " .
                    'Avisa a un administrador para asignar uno, o elige otra especialidad.';
            }

            return "Todos los doctores de {$especialidad->nombre} ya tienen una cita cerca de ese horario. " .
                '¿Quieres intentar con otra hora?';
        }

        // 5) Crear la cita delegando en CitaController::store ------------------
        // No duplicamos la logica de creacion/validacion aqui: reusamos el
        // mismo metodo que ya usa el resto del sistema, para que exista una
        // sola fuente de verdad sobre como se crea una cita.
        $subRequest = Request::create('/api/citas', 'POST', [
            'id_doctor' => $doctorDisponible->id_doctor,
            'fecha_hora' => $fechaHora->toDateTimeString(),
            'motivo_consulta' => 'Cita solicitada desde el asistente',
        ]);
        // CitaController::store ahora exige $request->user(): como esta
        // sub-request no paso por el middleware auth:sanctum, hay que
        // inyectar manualmente la identidad ya autenticada de este mismo
        // request principal.
        $subRequest->setUserResolver(fn () => $usuario);

        $respuesta = app(CitaController::class)->store($subRequest);
        $cuerpo = json_decode($respuesta->getContent(), true);

        if ($respuesta->getStatusCode() >= 400) {
            // Puede pasar por condicion de carrera (otro paciente tomo el
            // horario justo antes) u otra regla de negocio de CitaController.
            $mensaje = $cuerpo['message'] ?? 'No se pudo crear la cita.';
            return "No pude agendar la cita: {$mensaje} ¿Quieres intentar con otro horario?";
        }

        $cita = $cuerpo['cita'];
        $nombreDoctor = trim($doctorDisponible->nombres . ' ' . $doctorDisponible->apellido_paterno);

        return "¡Listo! Tu cita quedo agendada.\n" .
            "Folio: {$cita['id_cita']}\n" .
            "Especialidad: {$especialidad->nombre}\n" .
            "Doctor(a): {$nombreDoctor}\n" .
            "Fecha y hora: " . $fechaHora->format('d/m/Y H:i');
    }

    private function doctorOcupado(int $idDoctor, Carbon $momento): bool
    {
        return Cita::where('id_doctor', $idDoctor)
            ->whereIn('estado', ['programada', 'confirmada', 'en_curso'])
            ->whereBetween('fecha_hora', [$momento->copy()->subMinutes(30), $momento->copy()->addMinutes(30)])
            ->exists();
    }

    // ------------------------------------------------------------------
    // CONSULTAR CITAS (PACIENTE)
    // ------------------------------------------------------------------

    private function verCitasPaciente(?Paciente $paciente, Usuario $usuario): string
    {
        if (!$paciente) {
            return 'No encontre un expediente de paciente asociado a tu usuario.';
        }

        $subRequest = Request::create('/api/citas', 'GET', [
            'tipo_usuario' => 'paciente',
        ]);
        $subRequest->setUserResolver(fn () => $usuario);

        $respuesta = app(CitaController::class)->index($subRequest);
        $cuerpo = json_decode($respuesta->getContent(), true);
        $citas = collect($cuerpo['citas'] ?? []);

        $futuras = $citas->filter(function ($c) {
            return in_array($c['estado'], ['programada', 'confirmada', 'en_curso'])
                && Carbon::parse($c['fecha_hora'])->isFuture();
        })->sortBy('fecha_hora');

        if ($futuras->isEmpty()) {
            return 'No tienes citas futuras registradas. ¿Quieres agendar una?';
        }

        $lineas = $futuras->map(function ($c) {
            $especialidad = $c['doctor']['especialidad']['nombre'] ?? 'especialidad no definida';
            $doc = $c['doctor'] ?? null;
            $nombreDoctor = $doc
                ? trim(($doc['nombres'] ?? '') . ' ' . ($doc['apellido_paterno'] ?? ''))
                : 'doctor no asignado';
            $fecha = Carbon::parse($c['fecha_hora'])->format('d/m/Y H:i');
            return "- Folio {$c['id_cita']}: {$especialidad} con {$nombreDoctor}, {$fecha} ({$c['estado']})";
        })->implode("\n");

        return "Estas son tus proximas citas:\n{$lineas}";
    }

    // ------------------------------------------------------------------
    // TRATAMIENTO / RECETAS (PACIENTE)
    // ------------------------------------------------------------------

    private function verTratamiento(?Paciente $paciente): string
    {
        if (!$paciente) {
            return 'No encontre un expediente de paciente asociado a tu usuario.';
        }

        $citaIds = Cita::where('id_paciente', $paciente->id_paciente)->pluck('id_cita');

        if ($citaIds->isEmpty()) {
            return 'Aun no tienes consultas registradas, asi que no hay tratamiento que mostrar todavia.';
        }

        $consulta = ConsultaMedica::whereIn('id_cita', $citaIds)
            ->orderBy('fecha_consulta', 'desc')
            ->first();

        if (!$consulta) {
            return 'No encontre ninguna consulta medica registrada todavia, asi que no hay tratamiento activo. ' .
                'Cuando el doctor registre tu consulta, podras verlo aqui.';
        }

        $receta = Receta::where('id_consulta', $consulta->id_consulta)
            ->where('activa', 1)
            ->orderBy('fecha_emision', 'desc')
            ->first();

        if (!$receta) {
            return 'Tienes una consulta registrada, pero no hay una receta activa asociada por el momento.';
        }

        $medicamentos = MedicamentoReceta::where('id_receta', $receta->id_receta)->get();

        if ($medicamentos->isEmpty()) {
            return 'Tienes una receta activa, pero no tiene medicamentos capturados todavia.';
        }

        $lineas = $medicamentos->map(function ($m) {
            return "- {$m->medicamento}: {$m->dosis}, {$m->frecuencia}, por {$m->duracion}";
        })->implode("\n");

        return "Este es tu tratamiento activo:\n{$lineas}\n\n" .
            'Recuerda: no puedo ajustar dosis ni diagnosticos, cualquier duda coméntala directamente con tu doctor(a).';
    }

    private function registrarSeguimiento(?Paciente $paciente): string
    {
        if (!$paciente) {
            return 'No encontre un expediente de paciente asociado a tu usuario.';
        }

        // La tabla seguimiento_tratamientos es opcional en este proyecto.
        // Si no existe, respondemos con claridad en vez de tronar con un 500.
        if (!Schema::hasTable('seguimiento_tratamientos')) {
            return 'Por ahora no tengo forma de guardar ese seguimiento porque falta la tabla ' .
                '"seguimiento_tratamientos" en la base de datos. Puedo avisarle a tu doctor(a) en tu proxima consulta.';
        }

        try {
            DB::table('seguimiento_tratamientos')->insert([
                'id_paciente' => $paciente->id_paciente,
                'fecha_registro' => Carbon::now(),
                'descripcion' => 'Paciente confirmo toma de medicamento via chatbot',
            ]);

            return '¡Anotado! Registre que tomaste tu medicamento. Sigue asi.';
        } catch (\Throwable $e) {
            Log::error('Chatbot: error al registrar seguimiento', ['error' => $e->getMessage()]);
            return 'No pude guardar el seguimiento por un problema tecnico, pero tu mensaje quedo registrado en el log.';
        }
    }

    // ------------------------------------------------------------------
    // SOPORTE A DOCTORES
    // ------------------------------------------------------------------

    private function verAgendaDoctor(Doctor $doctor): string
    {
        $inicio = Carbon::today();
        $fin = Carbon::tomorrow();

        $citas = Cita::with('paciente')
            ->where('id_doctor', $doctor->id_doctor)
            ->whereBetween('fecha_hora', [$inicio, $fin])
            ->whereIn('estado', ['programada', 'confirmada', 'en_curso'])
            ->orderBy('fecha_hora')
            ->get();

        if ($citas->isEmpty()) {
            return 'No tienes citas programadas para hoy.';
        }

        $lineas = $citas->map(function ($c) {
            $nombrePaciente = $c->paciente
                ? trim($c->paciente->nombres . ' ' . $c->paciente->apellido_paterno)
                : 'paciente no encontrado';
            $hora = Carbon::parse($c->fecha_hora)->format('H:i');
            return "- {$hora}: {$nombrePaciente} ({$c->estado})";
        })->implode("\n");

        return "Tu agenda de hoy:\n{$lineas}";
    }

    private function agendaComoDoctor(Doctor $doctor): string
    {
        return 'Para agendar una cita a nombre de un paciente usa el panel medico ' .
            '(POST /doctor/citas), ahi puedes elegir paciente, fecha y hora directamente.';
    }

    // ------------------------------------------------------------------
    // EXTRACCION DE DATOS DEL LENGUAJE NATURAL
    // ------------------------------------------------------------------

    /**
     * Quita acentos y pasa a minusculas para poder comparar de forma
     * consistente, tanto el mensaje del usuario como los nombres en BD.
     */
    private function normalizar(string $texto): string
    {
        $texto = mb_strtolower($texto, 'UTF-8');
        $reemplazos = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ñ' => 'n', 'ü' => 'u',
        ];
        return strtr($texto, $reemplazos);
    }

    private function extraerEspecialidad(string $textoNormalizado): ?Especialidad
    {
        $especialidades = Especialidad::where('activo', 1)->get();

        foreach ($especialidades as $especialidad) {
            $nombreNormalizado = $this->normalizar($especialidad->nombre);
            if (str_contains($textoNormalizado, $nombreNormalizado)) {
                return $especialidad;
            }
        }

        return null;
    }

    private function extraerFecha(string $texto): ?Carbon
    {
        if (preg_match('/\bhoy\b/', $texto)) {
            return Carbon::today();
        }
        if (preg_match('/\bmañana\b/', $texto) || preg_match('/\bmanana\b/', $texto)) {
            return Carbon::tomorrow();
        }
        if (preg_match('/\bpasado mañana\b/', $texto) || preg_match('/\bpasado manana\b/', $texto)) {
            return Carbon::today()->addDays(2);
        }

        // Formato "15 de julio" o "15/07" o "15-07-2026"
        $meses = [
            'enero' => 1, 'febrero' => 2, 'marzo' => 3, 'abril' => 4, 'mayo' => 5, 'junio' => 6,
            'julio' => 7, 'agosto' => 8, 'septiembre' => 9, 'octubre' => 10, 'noviembre' => 11, 'diciembre' => 12,
        ];

        if (preg_match('/\b(\d{1,2})\s+de\s+(' . implode('|', array_keys($meses)) . ')\b/', $texto, $m)) {
            $dia = (int) $m[1];
            $mes = $meses[$m[2]];
            $anio = Carbon::now()->year;
            $fecha = Carbon::createFromDate($anio, $mes, $dia)->startOfDay();
            if ($fecha->isPast()) {
                $fecha->addYear();
            }
            return $fecha;
        }

        if (preg_match('/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/', $texto, $m)) {
            $dia = (int) $m[1];
            $mes = (int) $m[2];
            $anio = isset($m[3]) ? (int) $m[3] : Carbon::now()->year;
            if ($anio < 100) {
                $anio += 2000;
            }
            if ($dia > 12 && $mes <= 12) {
                // dd/mm ya esta bien
            }
            try {
                $fecha = Carbon::createFromDate($anio, $mes, $dia)->startOfDay();
                if (!isset($m[3]) && $fecha->isPast()) {
                    $fecha->addYear();
                }
                return $fecha;
            } catch (\Throwable $e) {
                return null;
            }
        }

        return null;
    }

    /**
     * Devuelve [hora, minuto], 'ambigua', o null (no se encontro hora).
     */
    private function extraerHora(string $texto)
    {
        if (!preg_match('/\ba las\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|de la manana|de la tarde|de la noche|hrs?|horas?)?\b/', $texto, $m)
            && !preg_match('/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/', $texto, $m)) {
            return null;
        }

        $hora = (int) $m[1];
        $minuto = isset($m[2]) && $m[2] !== '' ? (int) $m[2] : 0;
        $sufijo = isset($m[3]) ? trim($m[3]) : '';

        if ($minuto < 0 || $minuto > 59) {
            return null;
        }

        // Hora fuera de rango humano razonable, ej "a las 56"
        if ($hora < 0 || $hora > 23) {
            return null;
        }

        $tarde = in_array($sufijo, ['pm', 'de la tarde', 'de la noche']);
        $manana = in_array($sufijo, ['am', 'de la manana']);

        if ($hora >= 1 && $hora <= 12) {
            if ($tarde && $hora !== 12) {
                $hora += 12;
            }
            if ($manana && $hora === 12) {
                $hora = 0;
            }
            if (!$tarde && !$manana && $hora >= 1 && $hora <= 7) {
                // Ej. "a las 5" sin contexto: es ambiguo, pedir aclaracion.
                return 'ambigua';
            }
        }

        return [$hora, $minuto];
    }
}