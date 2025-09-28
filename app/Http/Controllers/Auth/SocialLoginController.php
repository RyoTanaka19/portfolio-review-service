<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class SocialLoginController extends Controller
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

            // 1. メールアドレスで既存ユーザーを検索
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // 既存ユーザーが存在する場合
                // social_id が未設定なら更新
                if (empty($user->social_id)) {
                    $user->social_id = $googleUser->getId();
                    $user->save();
                }
            } else {
                // 新規ユーザー作成
                $user = User::create([
                    'name' => $googleUser->getName() ?? '名無し',
                    'email' => $googleUser->getEmail(),
                    'social_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)), // Googleログインでは使用しません
                ]);
            }

            // ログイン
            Auth::login($user);

            return redirect()->intended('/portfolios')
                             ->with('flash', ['success' => 'Googleログインしました']);

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Googleログインに失敗しました');
        }
    }
}
