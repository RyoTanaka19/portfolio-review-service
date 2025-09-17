<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use App\Notifications\ReviewCreated;
use App\Notifications\ReviewUpdated;
use App\Notifications\ReviewChecked;
use Inertia\Inertia;
use App\Helpers\ReviewHelper;

class ReviewController extends Controller
{
    // レビュー投稿
    public function store(Request $request, Portfolio $portfolio)
    {
        try {
            $validated = $request->validate([
                'comment' => 'nullable|string|max:1000',
                'technical' => 'nullable|integer|between:1,5',
                'usability' => 'nullable|integer|between:1,5',
                'design' => 'nullable|integer|between:1,5',
                'user_focus' => 'nullable|integer|between:1,5',
            ]);

            if (
                is_null($validated['technical']) &&
                is_null($validated['usability']) &&
                is_null($validated['design']) &&
                is_null($validated['user_focus'])
            ) {
                return response()->json([
                    'success' => false,
                    'errors' => ['general' => 'いずれかの評価を入力してください'],
                ], 422);
            }

            $ratings = array_filter([
                $validated['technical'],
                $validated['usability'],
                $validated['design'],
                $validated['user_focus']
            ], fn($v) => !is_null($v));

            $rating = count($ratings) ? round(array_sum($ratings) / count($ratings), 1) : null;

            $review = Review::create([
                'user_id' => $request->user()->id,
                'portfolio_id' => $portfolio->id,
                'rating' => $rating,
                'comment' => $validated['comment'] ?? null,
                'technical' => $validated['technical'],
                'usability' => $validated['usability'],
                'design' => $validated['design'],
                'user_focus' => $validated['user_focus'],
            ]);

            // 通知（コメントがある場合のみ）
            if (!empty($review->comment)) {
                $portfolioOwner = $portfolio->user;
                $portfolioOwner->notify(new ReviewCreated($review));

                if ($review->user->id !== $portfolioOwner->id) {
                    $review->user->notify(new ReviewCreated($review));
                }
            }

            // ランキングキャッシュを削除
            ReviewHelper::clearRankingCache();

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

    public function destroy(Portfolio $portfolio, $reviewId)
    {
        $review = Review::where('id', $reviewId)
            ->where('portfolio_id', $portfolio->id)
            ->first();

        if (!$review) {
            return response()->json([
                'success' => true,
                'message' => 'レビューはすでに削除されています',
                'review_id' => $reviewId
            ]);
        }

        if ($review->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => '権限がありません'
            ], 403);
        }

        try {
            $review->delete();

            // ランキングキャッシュを削除
            ReviewHelper::clearRankingCache();

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

    public function update(Request $request, Portfolio $portfolio, Review $review)
    {
        if ($review->portfolio_id !== $portfolio->id) {
            abort(404, 'レビューが見つかりません');
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => '権限がありません'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'comment' => 'nullable|string|max:1000',
                'technical' => 'nullable|integer|between:1,5',
                'usability' => 'nullable|integer|between:1,5',
                'design' => 'nullable|integer|between:1,5',
                'user_focus' => 'nullable|integer|between:1,5',
            ]);

            if (
                is_null($validated['technical']) &&
                is_null($validated['usability']) &&
                is_null($validated['design']) &&
                is_null($validated['user_focus'])
            ) {
                return response()->json([
                    'success' => false,
                    'errors' => ['general' => 'いずれかの評価を入力してください'],
                ], 422);
            }

            $ratings = array_filter([
                $validated['technical'],
                $validated['usability'],
                $validated['design'],
                $validated['user_focus']
            ], fn($v) => !is_null($v));

            $rating = round(array_sum($ratings) / count($ratings), 1);

            $oldComment = $review->comment;

            $review->update([
                'comment' => $validated['comment'] ?? null,
                'technical' => $validated['technical'],
                'usability' => $validated['usability'],
                'design' => $validated['design'],
                'user_focus' => $validated['user_focus'],
                'rating' => $rating,
            ]);

            if (!empty($review->comment)) {
                $portfolioOwner = $portfolio->user;
                $portfolioOwner->notify(new ReviewUpdated($review, $oldComment));

                if ($review->user->id !== $portfolioOwner->id) {
                    $review->user->notify(new ReviewUpdated($review, $oldComment));
                }
            }

            // ランキングキャッシュを削除
            ReviewHelper::clearRankingCache();

            return response()->json([
                'success' => true,
                'message' => 'レビューを更新しました！',
                'review' => $review->load('user')
            ]);
        } catch (\Throwable $e) {
            \Log::error('レビュー更新失敗: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'レビュー更新に失敗しました',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkReview(Review $review)
    {
        $user = auth()->user();
        $wasChecked = $review->checked;

        $review->checked = !$wasChecked;
        $review->save();

        if (!$wasChecked && $review->checked) {
            $review->user->notify(new ReviewChecked($user, $review));
        }

        return response()->json([
            'success' => true,
            'checked' => $review->checked,
        ]);
    }

    // -----------------------------
    // ランキング関連メソッド（キャッシュ対応済）
    // -----------------------------
    public function ranking()
    {
        return $this->getRanking('rating', 'Reviews/Rankings/Total');
    }

    public function rankingTechnical()
    {
        return $this->getRanking('technical', 'Reviews/Rankings/Technical');
    }

    public function rankingUsability()
    {
        return $this->getRanking('usability', 'Reviews/Rankings/Usability');
    }

    public function rankingDesign()
    {
        return $this->getRanking('design', 'Reviews/Rankings/Design');
    }

    public function rankingUserFocus()
    {
        return $this->getRanking('user_focus', 'Reviews/Rankings/UserFocus');
    }

    private function getRanking(string $avgColumn, string $view)
    {
        $portfolios = ReviewHelper::getRanking($avgColumn);

        return Inertia::render($view, [
            'portfolios' => $portfolios,
        ]);
    }
}