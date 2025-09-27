<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password via AJAX/JSON.
     */
    public function update(Request $request)
    {
        try {
            // 入力値のバリデーション
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'], // 現在のパスワード確認
                'password' => ['required', Password::defaults(), 'confirmed'], // 新しいパスワード確認
            ]);

            // パスワードをハッシュ化して更新
            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            // 成功レスポンスを返す
            return response()->json([
                'success' => true,
                'message' => 'パスワードを更新しました',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // バリデーション失敗時
            return response()->json([
                'success' => false,
                'message' => '入力内容にエラーがあります',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            // その他のエラー
            return response()->json([
                'success' => false,
                'message' => 'パスワード更新中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
