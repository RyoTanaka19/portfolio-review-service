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
})->name('home'); 

Route::get('/autocomplete/users', [AutocompleteController::class, 'user']);

Route::get('/terms', [StaticPagesController::class, 'terms'])->name('terms');
Route::get('/privacy', [StaticPagesController::class, 'privacy'])->name('privacy');
Route::get('/contact', [StaticPagesController::class, 'form'])->name('contact');
Route::get('/how-to', [StaticPagesController::class, 'howTo'])->name('how_to');
Route::post('/contact', [StaticPagesController::class, 'submitContact'])->name('contact.send');

// Googleログイン（未ログインユーザーでもアクセス可能）
Route::get('auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback']);



// ランキング（未ログインでもアクセス可能）
// → ReviewController に移動したランキングメソッドを参照
Route::get('reviews/rankings/total', [ReviewController::class, 'ranking'])->name('ranking.total');
Route::get('reviews/rankings/technical', [ReviewController::class, 'rankingTechnical'])->name('ranking.technical');
Route::get('reviews/rankings/usability', [ReviewController::class, 'rankingUsability'])->name('ranking.usability');
Route::get('reviews/rankings/design', [ReviewController::class, 'rankingDesign'])->name('ranking.design');
Route::get('reviews/rankings/user-focus', [ReviewController::class, 'rankingUserFocus'])->name('ranking.user-focus');

// 通知関連（要ログイン）
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/{id}/check', [NotificationController::class, 'markAsChecked']);
});

// 認証済みユーザー用ルート
Route::middleware(['auth'])->group(function () {
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/portfolios/{portfolio}/bookmark', [BookmarkController::class, 'store'])->name('bookmark.store');
    Route::delete('/portfolios/{portfolio}/bookmark', [BookmarkController::class, 'destroy'])->name('bookmark.destroy');
});

// 誰でもアクセスできるポートフォリオ一覧
Route::get('/portfolios', [PortfolioController::class, 'index'])->name('dashboard');
Route::get('/portfolios/search', [PortfolioController::class, 'search'])->name('portfolios.search');
Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])
    ->whereNumber('portfolio')->name('portfolio.show');

// 認証済みユーザー用ルート（ポートフォリオ作成・編集・削除など）
Route::middleware(['auth', 'verified'])->group(function () {
    // ポートフォリオ
    Route::get('/portfolios/create', [PortfolioController::class, 'create'])->name('portfolios.create');
    Route::post('/portfolios', [PortfolioController::class, 'store'])->name('portfolios.store');
    Route::get('/portfolios/{portfolio}/edit', [PortfolioController::class, 'edit'])
        ->whereNumber('portfolio')->name('portfolios.edit');
    Route::put('/portfolios/{portfolio}', [PortfolioController::class, 'update'])
        ->whereNumber('portfolio')->name('portfolios.update');
    Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
        ->whereNumber('portfolio')->name('portfolio.destroy');

    // タグ
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');


    // レビュー
    Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])
        ->whereNumber('portfolio')->name('reviews.store');
    Route::delete('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'destroy'])
        ->whereNumber('portfolio')->whereNumber('review')->name('reviews.destroy');
    Route::post('/reviews/{review}/check', [ReviewController::class, 'checkReview'])->name('reviews.check');

    // AIアドバイス
    Route::get('/advices', [AdviceController::class, 'index'])->name('advices.index');

    Route::post('/advices', [AdviceController::class, 'store'])->name('api.advices.store');
    Route::get('/advices/create', [AdviceController::class, 'create'])->name('advices.create');
    Route::delete('/advices/{id}', [AdviceController::class, 'destroy'])->name('api.advices.destroy');

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
