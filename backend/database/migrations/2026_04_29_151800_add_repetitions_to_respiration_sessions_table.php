<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('respiration_sessions', function (Blueprint $table) {
            $table->unsignedInteger('repetitions')->default(1)->after('breathingRate');
        });
    }

    public function down(): void {
        Schema::table('respiration_sessions', function (Blueprint $table) {
            $table->dropColumn('repetitions');
        });
    }
};
