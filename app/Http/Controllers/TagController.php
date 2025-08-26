<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    // タグ一覧を返す（JSON）
    public function index()
    {
        $tags = Tag::orderBy('name')->get(['id','name']);
        return response()->json($tags);
    }
}
