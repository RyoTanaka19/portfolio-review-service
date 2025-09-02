<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use App\Notifications\ReviewCreated;
use App\Notifications\ReviewChecked; // 新規通知クラスを追加

class ReviewController extends Controller
{
    // レビュー投稿
    public function store(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // レビュー作成 → ポートフォリオ作者に通知
        $portfolio->user->notify(new ReviewCreated($review));

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

    // ✅ レビュー確認（チェックボックス押下） → 投稿者に通知
    public function checkReview(Review $review)
    {
        $user = auth()->user();

        // 任意: どのユーザーが確認したかを記録したい場合
        // $review->checked_by()->syncWithoutDetaching($user->id);

        // 投稿者に通知を送る
        $review->user->notify(new ReviewChecked($user, $review));

        return response()->json(['success' => true]);
    }
}
