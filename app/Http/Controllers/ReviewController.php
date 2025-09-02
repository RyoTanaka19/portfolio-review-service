<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use App\Notifications\ReviewCreated;


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
}
