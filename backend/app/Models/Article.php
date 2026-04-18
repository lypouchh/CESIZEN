<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model {
    protected $fillable = ['title', 'content', 'category', 'id_user'];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'id_user');
    }
}