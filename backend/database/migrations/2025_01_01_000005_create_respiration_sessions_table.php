<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('respiration_sessions', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date')->useCurrent();
            $table->bigInteger('duration');
            $table->bigInteger('breathingRate');
            $table->foreignId('id_user')->constrained('users');
            $table->foreignId('id_Exercise')->constrained('exercises');
        });
    }
    public function down(): void { Schema::dropIfExists('respiration_sessions'); }
};