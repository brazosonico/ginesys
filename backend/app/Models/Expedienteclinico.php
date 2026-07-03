<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpedienteClinico extends Model
{
    protected $table = 'expedientes_clinicos';
    protected $primaryKey = 'id_expediente';
    public $timestamps = false;

    protected $fillable = [
        'id_paciente',
        'numero_expediente',
        'antecedentes_familiares',
        'antecedentes_personales',
        'historial_ginecologico',
        'observaciones_generales',
        'activo',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }
}