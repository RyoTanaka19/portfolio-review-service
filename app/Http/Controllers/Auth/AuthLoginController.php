<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthLoginController extends Controller
{
    // Google にリダイレクト
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // コールバック処理
    public function handleGoogleCallback()
    {
        try {
            // Googleからユーザー情報を取得
            $googleUser = Socialite::driver('google')->stateless()->user();

            // auth_id（Googleの一意なID）でユーザー検索、なければ作成
            $user = User::firstOrCreate(
                ['auth_id' => $googleUser->getId()], // Googleのauth_idでユーザーを検索
                [
                    'name' => $googleUser->getName() ?? '名無し',
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(Str::random(16)), // 仮のパスワードを設定（Googleログインには使用しません）
                ]
            );

            // ログイン処理
            Auth::login($user);

            // フラッシュメッセージ付きでリダイレクト
            return redirect()->intended('/portfolios')
                             ->with('flash', ['success' => 'Googleログインしました']);

        } catch (\Exception $e) {
            // エラーログの記録
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            // エラーメッセージを表示してログイン画面へリダイレクト
            return redirect('/login')->with('error', 'Googleログインに失敗しました');
        }
    }
}
