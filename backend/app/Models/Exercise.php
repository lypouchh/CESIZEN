<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model {
    protected $fillable = ['name', 'description', 'inhaleDuration', 'exhaleDuration', 'holdDuration'];

    public function sessions(): HasMany {
        return $this->hasMany(RespirationSession::class, 'id_Exercise');
    }
}