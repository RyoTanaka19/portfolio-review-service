<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdviceController;
use App\Http\Controllers\Auth\GoogleLoginController;
use App\Http\Controllers\TagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ホーム
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Googleログイン（未ログインユーザーでもアクセス可能）
Route::get('auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback']);

// 🔽 ランキング（未ログインでもアクセス可能）
Route::get('/ranking', [PortfolioController::class, 'ranking'])->name('ranking');

// 認証済みユーザー用ルート
Route::middleware(['auth', 'verified'])->group(function () {

    // ポートフォリオ関連
    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('dashboard');
    Route::get('/portfolio/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolio', [PortfolioController::class, 'store'])->name('portfolio.store');

    // 動的ルートは数字のみ許可
    Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])
        ->whereNumber('portfolio')
        ->name('portfolio.show');
    Route::get('/portfolio/{portfolio}/edit', [PortfolioController::class, 'edit'])
        ->whereNumber('portfolio')
        ->name('portfolio.edit');
    Route::put('/portfolio/{portfolio}', [PortfolioController::class, 'update'])
        ->whereNumber('portfolio')
        ->name('portfolio.update');
    Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
        ->whereNumber('portfolio')
        ->name('portfolio.destroy');

    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');

    // レビュー関連
    Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])
        ->whereNumber('portfolio')
        ->name('reviews.store');
    Route::delete('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'destroy'])
        ->whereNumber('portfolio')
        ->whereNumber('review')
        ->name('reviews.destroy');

    // AIアドバイス関連
    Route::get('/advices', function () {
        return Inertia::render('Advices/Index');
    })->name('advices.index');

    Route::get('/api/advices', [AdviceController::class, 'index'])->name('api.advices.index');
    Route::post('/ai/advice', [AdviceController::class, 'store'])->name('advices.store');

    Route::get('/advice/create', function () {
        return Inertia::render('Advices/Create');
    })->name('advice.create');

    Route::delete('/api/advices/{id}', [AdviceController::class, 'destroy'])->name('api.advices.destroy');

    // プロフィール関連
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
