<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Paciente;
use App\Models\Doctor;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre'       => 'required|string|max:255|unique:usuarios,username',
            'correo'       => 'required|email|unique:usuarios,correo',
            'password'     => 'required|string|min:6|confirmed',
            'tipo_usuario' => 'required|in:paciente,doctor',
        ]);

        $idRol = $request->tipo_usuario === 'paciente' ? 1 : 2;

        $usuario = Usuario::create([
            'username'      => $request->nombre,
            'correo'        => $request->correo,
            'password_hash' => Hash::make($request->password),
            'id_rol'        => $idRol,
            'activo'        => true,
        ]);

        if ($request->tipo_usuario === 'paciente') {
            Paciente::create([
                'id_usuario'       => $usuario->id_usuario,
                'nombres'          => $request->nombre,
                'apellido_paterno' => '',
                'apellido_materno' => '',
                'fecha_nacimiento' => '2000-01-01',
                'activo'           => true,
            ]);
        } else {
            // Se crea el registro base en doctores.
            // El doctor completa cédula, especialidad y teléfono después desde /doctor/perfil
            Doctor::create([
                'id_usuario'          => $usuario->id_usuario,
                'nombres'             => $request->nombre,
                'apellido_paterno'    => '',
                'apellido_materno'    => '',
                'cedula_profesional'  => null,
                'telefono'            => null,
                'id_especialidad'     => null,
                'activo'              => true,
            ]);
        }

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuario,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo'       => 'required|email',
            'password'     => 'required|string',
            'tipo_usuario' => 'required|in:paciente,doctor',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            return response()->json([
                'message' => 'Correo o contraseña incorrectos',
            ], 401);
        }

        if (!$usuario->activo) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada',
            ], 403);
        }

        $rolEsperado = $request->tipo_usuario === 'paciente' ? 1 : 2;

        if ($usuario->id_rol != $rolEsperado) {
            return response()->json([
                'message' => 'El tipo de usuario no coincide con tu cuenta',
            ], 403);
        }

        // Se elimina cualquier token viejo antes de emitir uno nuevo, para que
        // no se acumulen tokens huerfanos cada vez que el usuario inicia sesion.
        $usuario->tokens()->delete();
        $token = $usuario->createToken('ginesys-app')->plainTextToken;

        return response()->json([
            'message'      => 'Login exitoso',
            'tipo_usuario' => $request->tipo_usuario,
            'token'        => $token,
            'usuario'      => [
                'id_usuario' => $usuario->id_usuario, // 👈 antes era 'id', no coincidía con el frontend
                'username'   => $usuario->username,
                'correo'     => $usuario->correo,
                'id_rol'     => $usuario->id_rol,
            ],
        ], 200);
    }

    /**
     * POST /api/logout
     * Revoca el token con el que se hizo esta peticion. Requiere
     * auth:sanctum, asi que $request->user() siempre existe aqui.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesion cerrada correctamente']);
    }
}