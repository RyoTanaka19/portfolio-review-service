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
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // タグをロード
        $user->load('tags');

        // プロフィール画像URLを付与
        $user->profile_image_url = $user->profile_image
            ? asset('image/profile_images/' . $user->profile_image)
            : null;

        $allTags = Tag::where('type', 'user')->get();

        return Inertia::render('Profiles/Edit', [
            'user' => $user,
            'allTags' => $allTags,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Show the profile of a specific user.
     */
    public function show(User $user): Response
    {
        $authUserId = auth()->id();

        // ユーザーのタグをロード
        $user->load('tags');

        // ポートフォリオ一覧を取得
        $portfolios = $user->portfolios()->with('reviews', 'tags')->get();

        // ポートフォリオ画像URLを付与
        $portfolios = $portfolios->map(function ($p) {
            $p->image_url = $p->image_path
                ? asset('storage/' . $p->image_path)
                : null;
            return $p;
        });

        // プロフィール画像URLを付与
        $user->profile_image_url = $user->profile_image
            ? asset('image/profile_images/' . $user->profile_image)
            : null;

        return Inertia::render('Profiles/Show', [
            'user' => $user,
            'authUserId' => $authUserId,
            'portfolios' => $portfolios,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        try {
            // validated データを取得し、画像・タグを除外
            $data = $request->validated();
            unset($data['profile_image'], $data['delete_profile_image'], $data['tags']);
            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // プロフィール画像アップロード（public/image/profile_images直下）
            if ($request->hasFile('profile_image')) {
                // 既存画像削除
                if ($user->profile_image) {
                    $oldPath = public_path('image/profile_images/' . $user->profile_image);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }

                $file = $request->file('profile_image');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('image/profile_images'), $filename);

                $user->profile_image = $filename;
            } elseif ($request->boolean('delete_profile_image')) {
                if ($user->profile_image) {
                    $oldPath = public_path('image/profile_images/' . $user->profile_image);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }
                $user->profile_image = null;
            }

            $user->save();

            // タグ更新
            $tagIds = $request->input('tags', []);
            $user->tags()->sync($tagIds);

            // 最新情報をロード
            $user->load('tags');
            $user->profile_image_url = $user->profile_image
                ? asset('image/profile_images/' . $user->profile_image)
                : null;

            return response()->json([
                'success' => true,
                'user' => $user,
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

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // ユーザー関連画像削除
        foreach ($user->portfolios as $portfolio) {
            if ($portfolio->image_path) {
                @unlink(public_path('storage/' . $portfolio->image_path));
            }
        }

        foreach ($user->reviews as $review) {
            if (isset($review->image_path) && $review->image_path) {
                @unlink(public_path('storage/' . $review->image_path));
            }
        }

        foreach ($user->bookmarks as $bookmark) {
            if (isset($bookmark->image_path) && $bookmark->image_path) {
                @unlink(public_path('storage/' . $bookmark->image_path));
            }
        }

        // プロフィール画像削除
        if ($user->profile_image) {
            $oldPath = public_path('image/profile_images/' . $user->profile_image);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::route('home')->with('flash', 'アカウントと関連データがすべて削除されました');
    }
}
