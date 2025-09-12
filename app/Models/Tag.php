<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    // ポートフォリオ (Tag belongs to many Portfolios)
    public function portfolios()
    {
        return $this->belongsToMany(Portfolio::class);
    }

public function users()
{
    return $this->belongsToMany(User::class, 'tag_user', 'tag_id', 'user_id');
}
}
