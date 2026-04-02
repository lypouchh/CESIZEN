<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('id_role')->default(2)->constrained('roles')->onDelete('restrict');
            $table->rememberToken();
            $table->timestamps(); // Crée created_at et updated_at
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};