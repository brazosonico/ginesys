<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
    protected $table = 'recetas';
    protected $primaryKey = 'id_receta';
    public $timestamps = false;

    protected $fillable = [
        'id_consulta',
        'indicaciones_generales',
        'fecha_emision',
        'activa',
    ];

    public function consulta()
    {
        return $this->belongsTo(ConsultaMedica::class, 'id_consulta', 'id_consulta');
    }

    public function medicamentos()
    {
        return $this->hasMany(MedicamentoReceta::class, 'id_receta', 'id_receta');
    }
}
