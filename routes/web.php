<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdviceController;
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

// 投稿一覧（自分のポートフォリオ）
Route::get('/portfolio', [PortfolioController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard'); // BreezeのHOMEと一致

// 新規投稿フォーム
Route::get('/portfolio/create', [PortfolioController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.create');

// 投稿保存
Route::post('/portfolio', [PortfolioController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.store');

// 投稿詳細
Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.show');

// 投稿削除
Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.destroy');

// 追加：編集フォーム
Route::get('/portfolio/{portfolio}/edit', [PortfolioController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.edit');

// 追加：編集更新処理
Route::put('/portfolio/{portfolio}', [PortfolioController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('portfolio.update');

Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

Route::delete('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'destroy'])
    ->name('reviews.destroy')
    ->middleware('auth');

Route::get('/create', function () {
    return Inertia::render('Advices/Create');
})->middleware(['auth', 'verified'])->name('advice');

// AIアドバイスAPI（POST）
Route::post('/ai/advice', [AdviceController::class, 'store'])
    ->middleware(['auth', 'verified']);

// プロフィール関連
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
