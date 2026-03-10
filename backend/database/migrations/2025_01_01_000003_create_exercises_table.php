<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->bigInteger('durationDefault');
            $table->bigInteger('breathingRateDefault');
            $table->string('animationType', 50);
        });
    }
    public function down(): void { Schema::dropIfExists('exercises'); }
};