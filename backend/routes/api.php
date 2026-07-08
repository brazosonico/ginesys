<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\EspecialidadController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ChatbotController;
/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
/*
|--------------------------------------------------------------------------
| CATALOGO PUBLICO (sin datos personales, se muestra antes de iniciar sesion)
|--------------------------------------------------------------------------
*/
Route::get('/especialidades', [EspecialidadController::class, 'index']);
Route::get('/doctores', [DoctorController::class, 'index']);
Route::get('/doctores/disponibles', [DoctorController::class, 'disponibles']);

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS: requieren un token valido (Authorization: Bearer ...)
| Dentro de estas, $request->user() siempre es el Usuario autenticado;
| ya no se confia en id_usuario ni X-Usuario-Id mandados por el cliente.
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // PERFIL
    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::put('/perfil', [PerfilController::class, 'update']);
    Route::delete('/perfil', [PerfilController::class, 'destroy']);

    // CITAS (COMPLETO)
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{id}', [CitaController::class, 'show']);
    Route::put('/citas/{id}', [CitaController::class, 'update']);
    Route::patch('/citas/{id}/cancelar', [CitaController::class, 'cancelar']);
    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);
    Route::get('/citas/{id}/receta', [CitaController::class, 'receta']);

    // DOCTOR (panel del medico)
    Route::get('/doctor/dashboard', [DoctorController::class, 'dashboard']);
    Route::get('/doctor/pacientes', [DoctorController::class, 'misPacientes']);
    Route::get('/doctor/perfil', [DoctorController::class, 'perfil']);
    Route::put('/doctor/perfil', [DoctorController::class, 'actualizarPerfil']);
    Route::post('/doctor/citas', [DoctorController::class, 'crearCita']);
    Route::patch('/doctor/citas/{id}/estado', [DoctorController::class, 'actualizarEstadoCita']);
    Route::get('/patients/{patientId}/clinical-record', [DoctorController::class, 'expedienteClinico']);
    Route::post('/doctor/citas/{id}/receta', [DoctorController::class, 'crearReceta']);

    // CHATBOT (ASISTENTE)
    Route::post('/chat', [ChatbotController::class, 'reply']);
});