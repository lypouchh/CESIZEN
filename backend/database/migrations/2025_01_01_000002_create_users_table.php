<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->string('passwordHash');
            $table->foreignId('id_role')->constrained('roles');
            $table->boolean('isActive')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};