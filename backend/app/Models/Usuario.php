<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'correo',
        'password_hash',
        'id_rol',
        'activo',
    ];

    protected $hidden = ['password_hash'];
}
