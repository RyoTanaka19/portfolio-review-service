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

            // まず social_id で既存ユーザーを検索
            $user = User::where('social_id', $googleUser->getId())->first();

            if (!$user) {
                // social_id が存在しない場合はメールで既存ユーザーを検索
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    // 既存ユーザーに social_id をセット
                    $user->social_id = $googleUser->getId();
                    $user->save();
                } else {
                    // 新規ユーザー作成
                    $user = User::create([
                        'name' => $googleUser->getName() ?? '名無し',
                        'email' => $googleUser->getEmail(),
                        'social_id' => $googleUser->getId(),
                        'password' => bcrypt(Str::random(16)), // Googleログインでは使用しません
                    ]);
                }
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
