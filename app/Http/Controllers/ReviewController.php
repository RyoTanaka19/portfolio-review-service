<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use App\Notifications\ReviewCreated;
use App\Notifications\ReviewChecked;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReviewController extends Controller
{
    // レビュー投稿
public function store(Request $request, Portfolio $portfolio)
{
    try {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'technical' => 'required|integer|min:1|max:5',
            'usability' => 'required|integer|min:1|max:5',
            'design' => 'required|integer|min:1|max:5',
            'user_focus' => 'required|integer|min:1|max:5',
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'technical' => $validated['technical'],
            'usability' => $validated['usability'],
            'design' => $validated['design'],
            'user_focus' => $validated['user_focus'],
        ]);

        // 通知（コメントがある場合のみ送信）
        if (!empty($review->comment)) {
            $portfolioOwner = $portfolio->user;
            $portfolioOwner->notify(new ReviewCreated($review));

            if ($review->user->id !== $portfolioOwner->id) {
                $review->user->notify(new ReviewCreated($review));
            }
        }

        // コメントがなくても user 情報を返す
        return response()->json([
            'success' => true,
            'message' => 'レビューしました！',
            'review' => $review->load('user')
        ]);
    } catch (\Throwable $e) {
        \Log::error('Review作成失敗: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'レビュー作成に失敗しました。',
            'error' => $e->getMessage()
        ], 500);
    }
}


// ReviewController.php
public function destroy(Portfolio $portfolio, Review $review)
{
    // このレビューが指定のポートフォリオに属しているか確認
    if ($review->portfolio_id !== $portfolio->id) {
        abort(404, 'レビューが見つかりません');
    }

    // レビューの作成者がログインユーザーか確認
    if ($review->user_id !== auth()->id()) {
        return response()->json([
            'success' => false,
            'message' => '権限がありません'
        ], 403);
    }

    try {
        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'レビューを削除しました！',
            'review_id' => $review->id
        ]);
    } catch (\Throwable $e) {
        \Log::error('レビュー削除失敗: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'レビュー削除に失敗しました',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function checkReview(Review $review)
{
    $user = auth()->user();

    // 保存前のチェック状態
    $wasChecked = $review->checked;

    // チェック状態を反転させて保存
    $review->checked = !$wasChecked;
    $review->save();

    // チェックが「入った場合」のみ通知
    if (!$wasChecked && $review->checked) {
        $review->user->notify(new ReviewChecked($user, $review));
    }

    return response()->json([
        'success' => true,
        'checked' => $review->checked, // 現在のチェック状態を返す
    ]);
}

    // -----------------------------
    // ランキング関連メソッド
    // -----------------------------

    // 総合ランキング
    public function ranking()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->has('reviews') // ★ レビューがあるものだけ
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatPortfolio($p));

        return Inertia::render('Reviews/Rankings/TotalRanking', [
            'portfolios' => $portfolios,
        ]);
    }

    // 技術力ランキング
    public function rankingTechnical()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'technical')
            ->has('reviews')
            ->orderByDesc('reviews_avg_technical')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatPortfolio($p, 'reviews_avg_technical'));

        return Inertia::render('Reviews/Rankings/TechnicalRanking', [
            'portfolios' => $portfolios,
        ]);
    }

    // 使いやすさランキング
    public function rankingUsability()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'usability')
            ->has('reviews')
            ->orderByDesc('reviews_avg_usability')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatPortfolio($p, 'reviews_avg_usability'));

        return Inertia::render('Reviews/Rankings/UsabilityRanking', [
            'portfolios' => $portfolios,
        ]);
    }

    // デザイン性ランキング
    public function rankingDesign()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'design')
            ->has('reviews')
            ->orderByDesc('reviews_avg_design')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatPortfolio($p, 'reviews_avg_design'));

        return Inertia::render('Reviews/Rankings/DesignRanking', [
            'portfolios' => $portfolios,
        ]);
    }

    // ユーザー目線ランキング
    public function rankingUserFocus()
    {
        $portfolios = Portfolio::with(['user', 'tags', 'reviews'])
            ->withAvg('reviews', 'user_focus')
            ->has('reviews')
            ->orderByDesc('reviews_avg_user_focus')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatPortfolio($p, 'reviews_avg_user_focus'));

        return Inertia::render('Reviews/Rankings/UserFocusRanking', [
            'portfolios' => $portfolios,
        ]);
    }

    // 共通フォーマット化
    private function formatPortfolio($p, $avgColumn = 'reviews_avg_rating')
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'description' => $p->description,
            'url' => $p->url,
            'github_url' => $p->github_url,
            'user_name' => $p->user->name ?? '未設定',
            'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
            'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
            'avg_rating' => round($p->$avgColumn, 2),
            'review_count' => $p->reviews->count(),
        ];
    }
}
