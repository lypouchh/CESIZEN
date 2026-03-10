<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens;

   // protected $table = 'User';
    // public $timestamps = false;

    protected $fillable = ['name', 'email', 'password'];

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
