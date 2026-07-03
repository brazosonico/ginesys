<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctores', function (Blueprint $table) {
            $table->string('cedula_profesional', 30)->nullable()->change();
            $table->unsignedBigInteger('id_especialidad')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('doctores', function (Blueprint $table) {
            $table->string('cedula_profesional', 30)->nullable(false)->change();
            $table->unsignedBigInteger('id_especialidad')->nullable(false)->change();
        });
    }
};