<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'url'
    ];

    // 投稿者 (1 Portfolio belongs to 1 User)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // レビュー (1 Portfolio has many Reviews)
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // タグ (Portfolio belongs to many Tags)
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
