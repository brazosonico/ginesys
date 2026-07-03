<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnostico extends Model
{
    protected $table = 'diagnosticos';
    protected $primaryKey = 'id_diagnostico';
    public $timestamps = false;

    protected $fillable = [
        'id_consulta',
        'descripcion',
        'codigo_cie10',
        'fecha_registro',
    ];

    public function consulta()
    {
        return $this->belongsTo(ConsultaMedica::class, 'id_consulta', 'id_consulta');
    }
}