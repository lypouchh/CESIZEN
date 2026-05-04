<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model {
   // protected $table = 'Role';
    public $timestamps = false;

    protected $fillable = ['nom'];

    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany {
        return $this->hasMany(User::class, 'id_role');
    }
}