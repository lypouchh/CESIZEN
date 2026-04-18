<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->integer('inhaleDuration');
            $table->integer('exhaleDuration');
            $table->integer('holdDuration');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('exercises'); }
};