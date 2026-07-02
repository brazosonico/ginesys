<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Paciente;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre'        => 'required|string|max:255|unique:usuarios,username',
            'correo'        => 'required|email|unique:usuarios,correo',
            'password'      => 'required|string|min:6|confirmed',
            'tipo_usuario'  => 'required|in:paciente,doctor',
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
        }

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuario,
        ], 201);
    }
}
