<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * すべてのタグを返す（JSON形式）
     */
    public function index()
    {
        try {
            $tags = Tag::orderBy('name')->get(['id', 'name']); // id と name を昇順で取得

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

    /**
     * type = 'user' のタグのみ返す（JSON形式）
     */
    public function userTags()
    {
        try {
            $tags = Tag::where('type', 'user')
                       ->orderBy('name')
                       ->get(['id', 'name']); // ユーザータグのみ取得

            return response()->json([
                'success' => true,
                'tags' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'ユーザータグの取得に失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
