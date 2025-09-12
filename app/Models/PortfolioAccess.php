<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioAccess extends Model
{
    use HasFactory;

    protected $fillable = ['portfolio_id', 'user_id', 'accessed_at'];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
