<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AutocompleteController extends Controller
{
    public function user(Request $request)
    {
        $query = $request->input('query');

        try {
            if (!$query) {
                return response()->json([]);
            }

            $users = User::where('name', 'like', "%{$query}%")
                ->limit(10) // 最大10件だけ返す
                ->get(['id', 'name']);

            return response()->json($users);
        } catch (\Exception $e) {
            // エラー発生時は空配列を返す
            return response()->json([], 500);
        }
    }
}
