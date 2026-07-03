<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicamentoReceta extends Model
{
    protected $table = 'medicamentos_receta';
    protected $primaryKey = 'id_medicamento_receta';
    public $timestamps = false;

    protected $fillable = [
        'id_receta',
        'medicamento',
        'dosis',
        'frecuencia',
        'duracion',
        'instrucciones',
    ];

    public function receta()
    {
        return $this->belongsTo(Receta::class, 'id_receta', 'id_receta');
    }
}