<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    protected $table = 'especialidades';
    protected $primaryKey = 'id_especialidad';
    public $timestamps = false;

    protected $fillable = ['nombre', 'descripcion', 'activo'];
}