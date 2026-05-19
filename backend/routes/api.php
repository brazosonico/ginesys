<?php

use Illuminate\Support\Facades\Route;

Route::get('/mensaje', function () {
    return response()->json([
        'mensaje' => 'Hola desde Laravel'
    ]);
});