<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::create([
            'user_id' => $request->user()->id,
            'portfolio_id' => $portfolio->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->back()->with('success', 'レビューしました！');
    }

    public function destroy(Portfolio $portfolio, Review $review)
{
    // 投稿者本人以外は削除できないようにチェック
    if ($review->user_id !== auth()->id()) {
        abort(403, '権限がありません');
    }

    $review->delete();

    return redirect()->back()->with('success', 'レビューを削除しました！');
}
}
