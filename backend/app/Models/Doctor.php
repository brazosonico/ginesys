<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Si ya tienes un Doctor.php en tu proyecto, compáralo con este
 * y no lo sobreescribas a ciegas. Si no existe, créalo con este
 * contenido.
 */
class Doctor extends Model
{
    protected $table = 'doctores';
    protected $primaryKey = 'id_doctor';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'cedula_profesional',
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'telefono',
        'id_especialidad',
        'activo',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }
}