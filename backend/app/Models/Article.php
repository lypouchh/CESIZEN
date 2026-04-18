<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model {
    protected $fillable = ['title', 'content', 'category', 'id_user'];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'article_user', 'article_id', 'user_id');
    }
}