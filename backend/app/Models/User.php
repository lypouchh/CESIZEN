<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory;

   // protected $table = 'User';
    // public $timestamps = false;

    protected $fillable = ['firstname', 'lastname', 'email', 'passwordHash', 'id_role', 'isActive'];

    public function role(): BelongsTo {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function articles(): HasMany {
        return $this->hasMany(Article::class, 'id_user');
    }

    public function respirationSessions(): HasMany {
        return $this->hasMany(RespirationSession::class, 'id_user');
    }

    /**
     * Vérifie si l'utilisateur a le rôle d'administrateur.
     */
    public function isAdmin(): bool {
        if ((int) $this->id_role === 1) {
            return true;
        }

        return $this->role && strtolower((string) $this->role->nom) === 'admin';
    }

    public function favoriteArticles()
    {
        return $this->belongsToMany(Article::class, 'article_user', 'user_id', 'article_id')->withTimestamps();
    }
}
