<?php

use App\Http\Controllers\{
    ProfileController,
    PortfolioController,
    ReviewController,
    AdviceController,
    Auth\SocialLoginController,
    TagController,
    NotificationController,
    StaticPagesController,
    BookmarkController,
    AutocompleteController,
    AccessController
};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| ホームページ
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| オートコンプリート
|--------------------------------------------------------------------------
*/
Route::get('/autocomplete/users', [AutocompleteController::class, 'user']);

/*
|--------------------------------------------------------------------------
| 静的ページ
|--------------------------------------------------------------------------
*/
Route::get('/terms', [StaticPagesController::class, 'terms'])->name('terms');
Route::get('/privacy', [StaticPagesController::class, 'privacy'])->name('privacy');
Route::get('/contact', [StaticPagesController::class, 'form'])->name('contact');
Route::post('/contact', [StaticPagesController::class, 'submitContact'])->name('contact.send');


/*
|--------------------------------------------------------------------------
| 認証・ソーシャルログイン（Google）
|--------------------------------------------------------------------------
*/
Route::get('auth/google', [SocialLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [SocialLoginController::class, 'handleGoogleCallback']);

/*
|--------------------------------------------------------------------------
| ランキング（未ログインでも閲覧可能）
|--------------------------------------------------------------------------
*/
Route::prefix('review/rankings')->group(function () {
    Route::get('total', [ReviewController::class, 'ranking'])->name('ranking.total');
    Route::get('technical', [ReviewController::class, 'rankingTechnical'])->name('ranking.technical');
    Route::get('usability', [ReviewController::class, 'rankingUsability'])->name('ranking.usability');
    Route::get('design', [ReviewController::class, 'rankingDesign'])->name('ranking.design');
    Route::get('user-focus', [ReviewController::class, 'rankingUserFocus'])->name('ranking.user-focus');
});

/*
|--------------------------------------------------------------------------
| 認証済みユーザー専用ルート（通知）
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

/*
|--------------------------------------------------------------------------
| 認証済みユーザー専用ルート（ブックマーク）
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/portfolios/{portfolio}/bookmark', [BookmarkController::class, 'store'])->name('bookmark.store');
    Route::delete('/portfolios/{portfolio}/bookmark', [BookmarkController::class, 'destroy'])->name('bookmark.destroy');
});

/*
|--------------------------------------------------------------------------
| ポートフォリオ閲覧（誰でもアクセス可能）
|--------------------------------------------------------------------------
*/
Route::get('/portfolios', [PortfolioController::class, 'index'])->name('portfolios.index');
Route::get('/portfolios/search', [PortfolioController::class, 'search'])->name('portfolios.search');
Route::get('/portfolio/{portfolio}', [PortfolioController::class, 'show'])
    ->whereNumber('portfolio')->name('portfolio.show');

/*
|--------------------------------------------------------------------------
| 認証済みユーザー専用ルート（ポートフォリオ管理・レビュー・タグ・AIアドバイス）
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // ポートフォリオ管理
    Route::get('/portfolios/create', [PortfolioController::class, 'create'])->name('portfolios.create');
    Route::post('/portfolios', [PortfolioController::class, 'store'])->name('portfolios.store');
    Route::get('/portfolios/{portfolio}/edit', [PortfolioController::class, 'edit'])
        ->whereNumber('portfolio')->name('portfolios.edit');
    Route::put('/portfolios/{portfolio}', [PortfolioController::class, 'update'])
        ->whereNumber('portfolio')->name('portfolios.update');
    Route::delete('/portfolio/{portfolio}', [PortfolioController::class, 'destroy'])
        ->whereNumber('portfolio')->name('portfolio.destroy');

    // ポートフォリオアクセス関連
    Route::get('/portfolio/{portfolio}/visit', [AccessController::class, 'track'])->name('portfolio.visit');
    Route::get('/portfolio/{portfolio}/accesses', [AccessController::class, 'index'])->name('portfolio.index');

    // タグ関連
    Route::get('/tags/user', [TagController::class, 'userTags']);
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::get('/tags/portfolio', [TagController::class, 'portfolioTags'])->name('tags.portfolioTags');

    // レビュー関連
    Route::post('/portfolio/{portfolio}/reviews', [ReviewController::class, 'store'])
        ->whereNumber('portfolio')->name('reviews.store');
    Route::delete('/portfolio/{portfolio}/reviews/{reviewId}', [ReviewController::class, 'destroy'])
        ->name('reviews.destroy');
    Route::put('/portfolio/{portfolio}/reviews/{review}', [ReviewController::class, 'update']);
    Route::post('/reviews/{review}/check', [ReviewController::class, 'checkReview'])->name('reviews.check');

    // AIアドバイス
    Route::get('/advices', [AdviceController::class, 'index'])->name('advices.index');
    Route::get('/advices/create', [AdviceController::class, 'create'])->name('advices.create');
    Route::post('/advices', [AdviceController::class, 'store'])->name('api.advices.store');
    Route::delete('/advices/{id}', [AdviceController::class, 'destroy'])->name('api.advices.destroy');

    // プロフィール
    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 認証ルートを読み込む
require __DIR__ . '/auth.php';
