<?php

namespace App\Http\Controllers;

use App\Models\Especialidad;

class EspecialidadController extends Controller
{
    // GET /api/especialidades
    public function index()
    {
        $especialidades = Especialidad::where('activo', true)->orderBy('nombre')->get();

        return response()->json(['especialidades' => $especialidades]);
    }
}