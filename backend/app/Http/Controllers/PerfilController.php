<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PerfilController extends Controller
{
    /**
     * NOTA DE SEGURIDAD:
     * El login actual no usa Sanctum ni sesión de Laravel, así que
     * aquí se identifica al usuario con el "id_usuario" que manda
     * el frontend (guardado en localStorage tras el login). Es
     * temporal: lo ideal a futuro es migrar a Sanctum y usar
     * $request->user() en vez de "id_usuario".
     */

    // GET /api/perfil?id_usuario=123&tipo_usuario=paciente
    public function show(Request $request)
    {
        $idUsuario = $request->query('id_usuario');
        $tipoUsuario = $request->query('tipo_usuario', 'paciente');

        if (!$idUsuario) {
            return response()->json(['message' => 'Falta id_usuario'], 400);
        }

        $usuario = Usuario::find($idUsuario);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $perfil = $this->buscarPerfil($idUsuario, $tipoUsuario);

        return response()->json([
            'usuario' => $usuario,
            'perfil' => $perfil,
            'tipo_usuario' => $tipoUsuario,
        ]);
    }

    // PUT /api/perfil
    public function update(Request $request)
    {
        $idUsuario = $request->input('id_usuario');
        $tipoUsuario = $request->input('tipo_usuario', 'paciente');

        if (!$idUsuario) {
            return response()->json(['message' => 'Falta id_usuario'], 400);
        }

        $usuario = Usuario::find($idUsuario);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|max:255',
            'correo' => 'sometimes|email|max:255|unique:usuarios,correo,' . $usuario->id_usuario . ',id_usuario',
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Datos inválidos', 'errors' => $validator->errors()], 422);
        }

        // 1) Actualiza cuenta (usuarios)
        $datosUsuario = $request->only(['username', 'correo']);
        if ($request->filled('password')) {
            $datosUsuario['password_hash'] = Hash::make($request->input('password'));
        }
        $usuario->update($datosUsuario);

        // 2) Actualiza ficha de perfil (pacientes o doctores)
        $perfil = $this->buscarPerfil($idUsuario, $tipoUsuario);

        if ($perfil) {
            if ($tipoUsuario === 'doctor') {
                $perfil->update($request->only([
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'telefono',
                    'cedula_profesional',
                    'id_especialidad',
                ]));
            } else {
                $perfil->update($request->only([
                    'nombres',
                    'apellido_paterno',
                    'apellido_materno',
                    'telefono',
                    'fecha_nacimiento',
                    'curp',
                    'correo_contacto',
                    'direccion',
                    'tipo_sangre',
                    'alergias',
                ]));
            }
        }

        return response()->json([
            'message' => 'Perfil actualizado',
            'usuario' => $usuario,
            'perfil' => $perfil,
        ]);
    }

    // DELETE /api/perfil?id_usuario=123
    public function destroy(Request $request)
    {
        $idUsuario = $request->query('id_usuario');

        if (!$idUsuario) {
            return response()->json(['message' => 'Falta id_usuario'], 400);
        }

        $usuario = Usuario::find($idUsuario);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Si tus llaves foráneas (pacientes.id_usuario, doctores.id_usuario)
        // no tienen ON DELETE CASCADE, hay que borrar esas filas primero
        // para evitar un error de integridad referencial.
        Paciente::where('id_usuario', $idUsuario)->delete();
        Doctor::where('id_usuario', $idUsuario)->delete();

        $usuario->delete();

        return response()->json(['message' => 'Cuenta eliminada correctamente']);
    }

    private function buscarPerfil($idUsuario, $tipoUsuario)
    {
        if ($tipoUsuario === 'doctor') {
            return Doctor::with('especialidad')->where('id_usuario', $idUsuario)->first();
        }

        return Paciente::where('id_usuario', $idUsuario)->first();
    }
}