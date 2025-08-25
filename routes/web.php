<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 投稿一覧
Route::get('/portfolio', [PortfolioController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard'); // Breeze の HOME と一致

// 新規フォーム
Route::get('/portfolio/create', [PortfolioController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.create');

// 投稿保存
Route::post('/portfolio', [PortfolioController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.store');

Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
