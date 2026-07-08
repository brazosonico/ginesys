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
     * Estas rutas viven dentro del grupo auth:sanctum (routes/api.php),
     * asi que $request->user() siempre es el Usuario autenticado por el
     * token. Ya no se confia en "id_usuario" mandado por el cliente:
     * antes, cualquiera podia leer/editar/borrar la cuenta de otra
     * persona con solo cambiar ese parametro.
     */

    // GET /api/perfil?tipo_usuario=paciente
    public function show(Request $request)
    {
        $usuario = $request->user();
        $tipoUsuario = $request->query('tipo_usuario', 'paciente');
        $idUsuario = $usuario->id_usuario;

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
        $usuario = $request->user();
        $idUsuario = $usuario->id_usuario;
        $tipoUsuario = $request->input('tipo_usuario', 'paciente');

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|max:255',
            'correo' => 'sometimes|email|max:255|unique:usuarios,correo,' . $usuario->id_usuario . ',id_usuario',
            'password' => 'sometimes|nullable|string|min:8',
            'genero' => 'sometimes|nullable|in:masculino,femenino',
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
                    'genero',
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

    // DELETE /api/perfil
    public function destroy(Request $request)
    {
        $usuario = $request->user();
        $idUsuario = $usuario->id_usuario;

        // Revoca todos sus tokens: si borra su cuenta, no debe quedar
        // ninguna sesion activa usable.
        $usuario->tokens()->delete();

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