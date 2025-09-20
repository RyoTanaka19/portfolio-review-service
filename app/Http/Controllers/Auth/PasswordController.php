<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class PasswordController extends Controller
{
    /**
     * Update the user's password via AJAX/JSON.
     */
    public function update(Request $request)
    {
        try {
            // バリデーション
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            // パスワード更新
            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'パスワードを更新しました',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // バリデーションエラー
            return response()->json([
                'success' => false,
                'message' => '入力内容にエラーがあります',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            // その他の例外
            return response()->json([
                'success' => false,
                'message' => 'パスワード更新中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
