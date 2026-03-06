<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('User', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('passwordHash');
            $table->string('firstname', 100);
            $table->string('lastname', 100);
            $table->timestamp('createdAt')->useCurrent();
            $table->boolean('isActive')->default(true);
            $table->foreignId('id_role')->constrained('Role');
        });
    }
    public function down(): void { Schema::dropIfExists('User'); }
};