<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'portfolio_id', 'rating', 'comment'
    ];

    // 投稿者 (1 Review belongs to 1 User)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 対象ポートフォリオ (1 Review belongs to 1 Portfolio)
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }
}
