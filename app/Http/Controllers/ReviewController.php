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
    /**
     * 新しいレビューを投稿する
     */
    public function store(Request $request, Portfolio $portfolio)
    {
        try {
            // バリデーション
            $validated = $request->validate([
                'comment' => 'nullable|string|max:1000',
                'technical' => 'nullable|integer|between:1,5',
                'usability' => 'nullable|integer|between:1,5',
                'design' => 'nullable|integer|between:1,5',
                'user_focus' => 'nullable|integer|between:1,5',
            ]);

            // 評価項目が全て空でないかを確認
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

            // 評価項目の平均値を計算
            $ratings = array_filter([
                $validated['technical'],
                $validated['usability'],
                $validated['design'],
                $validated['user_focus']
            ], fn($v) => !is_null($v));

            $rating = count($ratings) ? round(array_sum($ratings) / count($ratings), 1) : null;

            // レビューを保存
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

            // コメントがある場合、通知を送信
            if (!empty($review->comment)) {
                $portfolioOwner = $portfolio->user;
                $portfolioOwner->notify(new ReviewCreated($review));

                // 自分以外のユーザーには通知
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
            // エラー処理
            \Log::error('Review作成失敗: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'レビュー作成に失敗しました。',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * レビューを削除する
     */
    public function destroy(Portfolio $portfolio, $reviewId)
    {
        // レビューが存在するか確認
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

        // 削除権限の確認
        if ($review->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => '権限がありません'
            ], 403);
        }

        try {
            // レビューを削除
            $review->delete();

            // ランキングキャッシュを削除
            ReviewHelper::clearRankingCache();

            return response()->json([
                'success' => true,
                'message' => 'レビューを削除しました！',
                'review_id' => $review->id
            ]);
        } catch (\Throwable $e) {
            // エラー処理
            \Log::error('レビュー削除失敗: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'レビュー削除に失敗しました',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * レビューを更新する
     */
    public function update(Request $request, Portfolio $portfolio, Review $review)
    {
        // 更新対象のレビューが正しいか確認
        if ($review->portfolio_id !== $portfolio->id) {
            abort(404, 'レビューが見つかりません');
        }

        // 更新権限の確認
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => '権限がありません'
            ], 403);
        }

        try {
            // バリデーション
            $validated = $request->validate([
                'comment' => 'nullable|string|max:1000',
                'technical' => 'nullable|integer|between:1,5',
                'usability' => 'nullable|integer|between:1,5',
                'design' => 'nullable|integer|between:1,5',
                'user_focus' => 'nullable|integer|between:1,5',
            ]);

            // 評価項目が全て空でないかを確認
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

            // 評価項目の平均値を計算
            $ratings = array_filter([
                $validated['technical'],
                $validated['usability'],
                $validated['design'],
                $validated['user_focus']
            ], fn($v) => !is_null($v));

            $rating = round(array_sum($ratings) / count($ratings), 1);

            $oldComment = $review->comment;

            // レビューを更新
            $review->update([
                'comment' => $validated['comment'] ?? null,
                'technical' => $validated['technical'],
                'usability' => $validated['usability'],
                'design' => $validated['design'],
                'user_focus' => $validated['user_focus'],
                'rating' => $rating,
            ]);

            // コメントが変更された場合、通知を送信
            if (!empty($review->comment)) {
                $portfolioOwner = $portfolio->user;
                $portfolioOwner->notify(new ReviewUpdated($review, $oldComment));

                // 自分以外のユーザーには通知
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
            // エラー処理
            \Log::error('レビュー更新失敗: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'レビュー更新に失敗しました',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * レビューの確認ステータスを切り替える
     */
    public function checkReview(Review $review)
    {
        $user = auth()->user();
        $wasChecked = $review->checked;

        // 確認ステータスを切り替え
        $review->checked = !$wasChecked;
        $review->save();

        // 確認ステータス変更通知
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
    /**
     * 総合ランキングを取得
     */
    public function ranking()
    {
        return $this->getRanking('rating', 'Reviews/Rankings/Total');
    }

    /**
     * 技術ランキングを取得
     */
    public function rankingTechnical()
    {
        return $this->getRanking('technical', 'Reviews/Rankings/Technical');
    }

    /**
     * 使用感ランキングを取得
     */
    public function rankingUsability()
    {
        return $this->getRanking('usability', 'Reviews/Rankings/Usability');
    }

    /**
     * デザインランキングを取得
     */
    public function rankingDesign()
    {
        return $this->getRanking('design', 'Reviews/Rankings/Design');
    }

    /**
     * ユーザー重視ランキングを取得
     */
    public function rankingUserFocus()
    {
        return $this->getRanking('user_focus', 'Reviews/Rankings/UserFocus');
    }

    /**
     * 指定した評価のランキングを取得
     */
    private function getRanking(string $avgColumn, string $view)
    {
        $portfolios = ReviewHelper::getRanking($avgColumn);

        return Inertia::render($view, [
            'portfolios' => $portfolios,
        ]);
    }
}
