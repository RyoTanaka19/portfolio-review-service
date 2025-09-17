<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BookmarkController extends Controller
{
    // ブックマーク登録
public function store(Portfolio $portfolio)
{
    $user = auth()->user();

    try {
        $bookmark = Bookmark::firstOrCreate([
            'user_id' => $user->id,
            'portfolio_id' => $portfolio->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ブックマークしました', // フラッシュメッセージとして使える
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'ブックマークに失敗しました',
        ], 500);
    }
}

    // ブックマーク解除

public function destroy(Portfolio $portfolio)
{
    $user = auth()->user();

    try {
        Bookmark::where('user_id', $user->id)
            ->where('portfolio_id', $portfolio->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'ブックマークを解除しました',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'ブックマーク解除に失敗しました',
        ], 500);
    }
}

    // お気に入り一覧ページ
    public function index()
    {
        $user = auth()->user();

        $bookmarks = Bookmark::with('portfolio.user', 'portfolio.tags', 'portfolio.reviews.user')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($b) {
                $p = $b->portfolio;
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'url' => $p->url,
                    'user_id' => $p->user_id,
                    'user_name' => $p->user->name ?? '未設定',
                    'image_url' => $p->image_path ? Storage::url($p->image_path) : null,
                    'tags' => $p->tags->map(fn($t) => $t->name)->toArray(),
                    'reviews' => $p->reviews->map(fn($r) => [
                        'id' => $r->id,
                        'comment' => $r->comment,
                        'rating' => $r->rating,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name ?? '未設定',
                        ],
                        'created_at' => $r->created_at->format('Y-m-d H:i'),
                    ]),
                    'is_bookmarked' => true, // ブックマーク済みフラグ
                ];
            });

        return Inertia::render('Bookmark/Index', [
            'portfolios' => $bookmarks, // React 側の props に合わせる
        ]);
    }
}
