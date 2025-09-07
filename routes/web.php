<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdviceController;
use App\Http\Controllers\Auth\GoogleLoginController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StaticPagesController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\AutocompleteController;
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
Route::get('/autocomplete/users', [AutocompleteController::class, 'user']);

Route::get('/terms', [StaticPagesController::class, 'terms'])->name('terms');
Route::get('/privacy', [StaticPagesController::class, 'privacy'])->name('privacy');
Route::get('/contact', [StaticPagesController::class, 'form'])->name('contact');
Route::get('/how-to', [StaticPagesController::class, 'howTo'])->name('how_to');
Route::post('/contact', [StaticPagesController::class, 'submitContact'])->name('contact.send');

// Googleログイン（未ログインユーザーでもアクセス可能）
Route::get('auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback']);

Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');

// ランキング（未ログインでもアクセス可能）
Route::get('/ranking', [PortfolioController::class, 'ranking'])->name('ranking');

Route::get('/ranking/technical', [PortfolioController::class, 'rankingTechnical'])->name('ranking.technical');
Route::get('/ranking/usability', [PortfolioController::class, 'rankingUsability'])->name('ranking.usability');
Route::get('/ranking/design', [PortfolioController::class, 'rankingDesign'])->name('ranking.design');
Route::get('/ranking/user-focus', [PortfolioController::class, 'rankingUserFocus'])->name('ranking.user_focus');

// 通知関連（要ログイン）
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

Route::middleware(['auth'])->group(function () {
    Route::post('/portfolio/{portfolio}/bookmark', [BookmarkController::class, 'store'])->name('bookmark.store');
    Route::delete('/portfolio/{portfolio}/bookmark', [BookmarkController::class, 'destroy'])->name('bookmark.destroy');
});

// 誰でもアクセスできるポートフォリオ一覧

 Route::get('/portfolio', [PortfolioController::class, 'index'])->name('dashboard');

// 認証済みユーザー用ルート
Route::middleware(['auth', 'verified'])->group(function () {

    // ポートフォリオ関連（作成・編集・削除など）
    Route::get('/portfolio/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolio', [PortfolioController::class, 'store'])->name('portfolio.store');

    Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])
        ->whereNumber('portfolio')->name('portfolio.show');
    Route::get('/portfolio/{portfolio}/edit', [PortfolioController::class, 'edit'])
        ->whereNumber('portfolio')->name('portfolio.edit');
    Route::put('/portfolio/{portfolio}', [PortfolioController::class, 'update'])
        ->whereNumber('portfolio')->name('portfolio.update');
    Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
        ->whereNumber('portfolio')->name('portfolio.destroy');

    // タグ関連
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');

    // レビュー関連
    Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])
        ->whereNumber('portfolio')->name('reviews.store');
    Route::delete('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'destroy'])
        ->whereNumber('portfolio')->whereNumber('review')->name('reviews.destroy');
    Route::post('/reviews/{review}/check', [ReviewController::class, 'checkReview'])->name('reviews.check');

    // AIアドバイス関連
    Route::get('/advices', fn () => Inertia::render('Advices/Index'))->name('advices.index');
    Route::get('/api/advices', [AdviceController::class, 'index'])->name('api.advices.index');
    Route::post('/ai/advice', [AdviceController::class, 'store'])->name('advices.store');
    Route::get('/advice/create', fn () => Inertia::render('Advices/Create'))->name('advice.create');
    Route::delete('/api/advices/{id}', [AdviceController::class, 'destroy'])->name('api.advices.destroy');

    // プロフィール関連
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
