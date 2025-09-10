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
    // バリデーション
    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'nullable|string|max:1000',
        'technical' => 'required|integer|min:1|max:5',
        'usability' => 'required|integer|min:1|max:5',
        'design' => 'required|integer|min:1|max:5',
        'user_focus' => 'required|integer|min:1|max:5',
    ]);

    // レビュー作成
    $review = Review::create([
        'user_id' => $request->user()->id,
        'portfolio_id' => $portfolio->id,
        'rating' => $request->rating,
        'comment' => $request->comment,
        'technical' => $request->technical,
        'usability' => $request->usability,
        'design' => $request->design,
        'user_focus' => $request->user_focus,
    ]);

    // 通知処理（コメントがある場合のみ）
    if (!empty($review->comment)) {
        $reviewer = $review->user;                 // 自分
        $portfolioOwner = $portfolio->user;        // ポートフォリオ所有者

        // 1. ポートフォリオ所有者に通知
        $portfolioOwner->notify(new ReviewCreated($review));

        // 2. 自分にも通知（ポートフォリオが自分のものじゃない場合）
        if ($reviewer->id !== $portfolioOwner->id) {
            $reviewer->notify(new ReviewCreated($review));
        }

        // 3. 必要なら他ユーザーにも通知可能（フォロワーなど）
        // Notification::send($otherUsers, new ReviewCreated($review));
    }

    return redirect()->back()->with('success', 'レビューしました！');
}

    // レビュー削除
    public function destroy(Portfolio $portfolio, Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            abort(403, '権限がありません');
        }

        $review->delete();

        return redirect()->back()->with('success', 'レビューを削除しました！');
    }

    // レビュー確認
    public function checkReview(Review $review)
    {
        $user = auth()->user();
        $review->user->notify(new ReviewChecked($user, $review));

        return response()->json(['success' => true]);
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
