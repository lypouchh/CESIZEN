<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('RespirationSession', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date')->useCurrent();
            $table->bigInteger('duration');
            $table->bigInteger('breathingRate');
            $table->foreignId('id_user')->constrained('User');
            $table->foreignId('id_Exercise')->constrained('Exercise');
        });
    }
    public function down(): void { Schema::dropIfExists('RespirationSession'); }
};