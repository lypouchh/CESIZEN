<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model {
    protected $table = 'Role';
    public $timestamps = false;

    protected $fillable = ['nom'];
}