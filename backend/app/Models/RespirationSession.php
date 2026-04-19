<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RespirationSession extends Model {
    protected $table = 'respiration_sessions';
    public $timestamps = false;

    protected $fillable = ['date', 'duration', 'breathingRate', 'id_user', 'id_Exercise'];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function exercise(): BelongsTo {
        return $this->belongsTo(Exercise::class, 'id_Exercise');
    }
}