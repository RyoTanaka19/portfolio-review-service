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

// 認証済みユーザー用ルート
Route::middleware(['auth', 'verified'])->group(function () {

    // ポートフォリオ関連
    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('dashboard');
    Route::get('/portfolio/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolio', [PortfolioController::class, 'store'])->name('portfolio.store');
    Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])->name('portfolio.show');
    Route::get('/portfolio/{portfolio}/edit', [PortfolioController::class, 'edit'])->name('portfolio.edit');
    Route::put('/portfolio/{portfolio}', [PortfolioController::class, 'update'])->name('portfolio.update');
    Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])->name('portfolio.destroy');

    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');

    // レビュー関連
    Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::delete('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // AIアドバイス一覧ページ（Reactコンポーネント表示）
    Route::get('/advices', function () {
        return Inertia::render('Advices/Index'); // Index.jsx を表示
    })->name('advices.index');

    // AIアドバイス一覧取得API（JSON）
    Route::get('/api/advices', [AdviceController::class, 'index'])->name('api.advices.index');

    // AIアドバイス作成（POST）
    Route::post('/ai/advice', [AdviceController::class, 'store'])->name('advices.store');

    // AIアドバイス作成ページ（Reactコンポーネント表示）
    Route::get('/advice/create', function () {
        return Inertia::render('Advices/Create'); // Create.jsx を表示
    })->name('advice.create');

    // AIアドバイス削除（API）
    Route::delete('/api/advices/{id}', [AdviceController::class, 'destroy'])
        ->name('api.advices.destroy');

    // プロフィール関連
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
