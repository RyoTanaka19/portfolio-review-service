<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Portfolio;
use App\Models\Tag;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Helpers\PortfolioHelper;

class ProfileController extends Controller
{
    // プロフィール編集画面表示
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('tags'); // タグをロード
        $allTags = Tag::where('type', 'user')->get();
        $profileImageUrl = $user->profile_image ? Storage::disk('s3')->url($user->profile_image) : null;

        return Inertia::render('Profiles/Edit', [
            'user' => $user,
            'allTags' => $allTags,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'userProfileImageUrl' => $profileImageUrl,
        ]);
    }

    // 特定ユーザーのプロフィール表示
    public function show(User $user): Response
    {
        $authUserId = auth()->id();
        $user->load('tags');

        $portfolios = $user->portfolios()->with('reviews', 'tags')->get()->map(function ($p) {
            $p->image_url = $p->service_url ? PortfolioHelper::getOgImage($p->service_url) : null;
            return $p;
        });

        $profileImageUrl = $user->profile_image ? Storage::disk('s3')->url($user->profile_image) : null;

        return Inertia::render('Profiles/Show', [
            'user' => $user,
            'authUserId' => $authUserId,
            'portfolios' => $portfolios,
            'profileImageUrl' => $profileImageUrl,
        ]);
    }

    // プロフィール更新
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        try {
            $data = $request->validated();
            unset($data['tags']); // タグは別処理

            // 画像アップロード
            if ($request->hasFile('profile_image')) {
                if ($user->profile_image) {
                    Storage::disk('s3')->delete($user->profile_image);
                }
                $data['profile_image'] = $request->file('profile_image')->store('profile_images', 's3');
            }

            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // タグ同期
            $user->tags()->sync($request->input('tags', []));
            $user->save();
            $user->load('tags');

            // 画像URLは null でも安全に返す
            $profileImageUrl = $user->profile_image ? Storage::disk('s3')->url($user->profile_image) : null;

            return response()->json([
                'success' => true,
                'user' => $user,
                'profileImageUrl' => $profileImageUrl,
                'message' => 'プロフィール情報を更新しました',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'プロフィールの更新中にエラーが発生しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // アカウント削除
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password']
        ]);

        $user = $request->user();
        Auth::logout();

        // S3上の画像削除
        if ($user->profile_image) {
            Storage::disk('s3')->delete($user->profile_image);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::route('home')->with('flash', 'アカウントと関連データがすべて削除されました');
    }
}
