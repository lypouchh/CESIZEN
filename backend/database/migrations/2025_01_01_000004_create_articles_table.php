<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('category', 100);
            $table->foreignId('id_user')->constrained('users');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('articles'); }
};