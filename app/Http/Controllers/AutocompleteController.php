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

            // 同じ名前のユーザーは1件だけ取得
            $users = User::where('name', 'like', "%{$query}%")
                ->select('id', 'name')
                ->distinct('name') // name の重複を除外
                ->limit(10)
                ->get();

            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([], 500);
        }
    }
}
