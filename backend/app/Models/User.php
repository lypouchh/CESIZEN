<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable {
    protected $table = 'User';
    public $timestamps = false; // Géré par createdAt en SQL (DEFAULT CURRENT_TIMESTAMP)

    protected $fillable = ['email', 'passwordHash', 'firstname', 'lastname', 'isActive', 'id_role'];

    /**
     * Indique à Laravel d'utiliser 'passwordHash' au lieu de 'password'
     */
    public function getAuthPassword()
    {
        return $this->passwordHash;
    }

    public function role(): BelongsTo {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function articles(): HasMany {
        return $this->hasMany(Article::class, 'id_user');
    }

    public function respirationSessions(): HasMany {
        return $this->hasMany(RespirationSession::class, 'id_user');
    }
}
