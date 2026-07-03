<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsultaMedica extends Model
{
    protected $table = 'consultas_medicas';
    protected $primaryKey = 'id_consulta';
    public $timestamps = false;

    protected $fillable = [
        'id_cita',
        'id_doctor',
        'id_expediente',
        'sintomas',
        'exploracion_fisica',
        'observaciones',
        'fecha_consulta',
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'id_cita', 'id_cita');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'id_doctor', 'id_doctor');
    }

    public function expediente()
    {
        return $this->belongsTo(ExpedienteClinico::class, 'id_expediente', 'id_expediente');
    }

    public function diagnosticos()
    {
        return $this->hasMany(Diagnostico::class, 'id_consulta', 'id_consulta');
    }

    public function recetas()
    {
        return $this->hasMany(Receta::class, 'id_consulta', 'id_consulta');
    }
}