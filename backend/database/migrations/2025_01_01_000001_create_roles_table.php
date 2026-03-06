<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('Role', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 10);
        });
    }
    public function down(): void { Schema::dropIfExists('Role'); }
};