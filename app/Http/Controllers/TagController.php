<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * type = 'portfolio' のタグのみ返す（JSON形式）
     */
    public function portfolioTags()
    {
        try {
            $tags = Tag::where('type', 'portfolio')
                       ->orderBy('name')
                       ->get(['id', 'name']);

            return response()->json([
                'success' => true,
                'tags' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'ポートフォリオタグの取得に失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
