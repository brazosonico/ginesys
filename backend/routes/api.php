<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\EspecialidadController;
use App\Http\Controllers\DoctorController;
/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
/*
|--------------------------------------------------------------------------
| PERFIL
|--------------------------------------------------------------------------
*/
Route::get('/perfil', [PerfilController::class, 'show']);
Route::put('/perfil', [PerfilController::class, 'update']);
Route::delete('/perfil', [PerfilController::class, 'destroy']);
/*
|--------------------------------------------------------------------------
| CITAS (COMPLETO)
|--------------------------------------------------------------------------
*/
Route::get('/citas', [CitaController::class, 'index']);           // listar citas
Route::post('/citas', [CitaController::class, 'store']);          // crear cita
Route::get('/citas/{id}', [CitaController::class, 'show']);       // ver cita
Route::put('/citas/{id}', [CitaController::class, 'update']);     // actualizar cita
Route::patch('/citas/{id}/cancelar', [CitaController::class, 'cancelar']); // cancelar
Route::delete('/citas/{id}', [CitaController::class, 'destroy']); // eliminar
/*
|--------------------------------------------------------------------------
| ESPECIALIDADES
|--------------------------------------------------------------------------
*/
Route::get('/especialidades', [EspecialidadController::class, 'index']);
Route::get('/doctores', [DoctorController::class, 'index']);
/*
|--------------------------------------------------------------------------
| DOCTOR (panel del médico)
|--------------------------------------------------------------------------
*/
Route::get('/doctor/dashboard', [DoctorController::class, 'dashboard']);
Route::get('/doctor/pacientes', [DoctorController::class, 'misPacientes']);
Route::get('/doctor/perfil', [DoctorController::class, 'perfil']);
Route::put('/doctor/perfil', [DoctorController::class, 'actualizarPerfil']);
Route::post('/doctor/citas', [DoctorController::class, 'crearCita']);
Route::patch('/doctor/citas/{id}/estado', [DoctorController::class, 'actualizarEstadoCita']);
Route::get('/patients/{patientId}/clinical-record', [DoctorController::class, 'expedienteClinico']);
Route::post('/doctor/citas/{id}/receta', [DoctorController::class, 'crearReceta']);
Route::get('/citas/{id}/receta', [CitaController::class, 'receta']);
Route::get('/doctores/disponibles', [DoctorController::class, 'disponibles']);