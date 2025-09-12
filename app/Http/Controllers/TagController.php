<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    /**
     * タグ一覧を返す（JSON）
     */
    public function index()
    {
        try {
            $tags = Tag::orderBy('name')->get(['id', 'name']);

            return response()->json([
                'success' => true,
                'tags' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'タグの取得に失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function userTags()
{
    try {
        $tags = Tag::where('type', 'user')->orderBy('name')->get(['id', 'name']);
        return response()->json(['success' => true, 'tags' => $tags]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'ユーザータグの取得に失敗しました',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
