<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewPortfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'user_id',
    ];
}
