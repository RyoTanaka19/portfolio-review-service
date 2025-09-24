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

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('tags');

        // プロフィール画像 URL を public 用に設定
        $user->profile_image_url = $user->profile_image
            ? $this->getPublicUrl($user->profile_image)
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
        $user->load('tags');

        // ポートフォリオ一覧を取得
        $portfolios = $user->portfolios()->with('reviews', 'tags')->get();

        // ポートフォリオ画像 URL を public 用に付与
        $portfolios = $portfolios->map(function ($p) {
            $p->image_url = $p->image_path
                ? $this->getPublicUrl($p->image_path)
                : null;
            return $p;
        });

        // プロフィール画像 URL
        $user->profile_image_url = $user->profile_image
            ? $this->getPublicUrl($user->profile_image)
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
            $data = $request->validated();
            unset($data['profile_image'], $data['delete_profile_image'], $data['tags']);
            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // プロフィール画像アップロード (public)
            if ($request->hasFile('profile_image')) {
                if ($user->profile_image) {
                    Storage::disk('s3')->delete($user->profile_image);
                }

                $path = Storage::disk('s3')->putFile(
                    'profile_images',
                    $request->file('profile_image'),
                    'public'
                );

                $user->profile_image = $path;
            } elseif ($request->boolean('delete_profile_image')) {
                if ($user->profile_image) {
                    Storage::disk('s3')->delete($user->profile_image);
                }
                $user->profile_image = null;
            }

            $user->save();

            // タグ更新
            $user->tags()->sync($request->input('tags', []));

            // 最新情報をロード
            $user->load('tags');
            $user->profile_image_url = $user->profile_image
                ? $this->getPublicUrl($user->profile_image)
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

        // ポートフォリオ / レビュー / ブックマーク / プロフィール画像削除
        foreach ($user->portfolios as $p) {
            if ($p->image_path) Storage::disk('s3')->delete($p->image_path);
        }

        foreach ($user->reviews as $r) {
            if (isset($r->image_path) && $r->image_path) Storage::disk('s3')->delete($r->image_path);
        }

        foreach ($user->bookmarks as $b) {
            if (isset($b->image_path) && $b->image_path) Storage::disk('s3')->delete($b->image_path);
        }

        if ($user->profile_image) {
            Storage::disk('s3')->delete($user->profile_image);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::route('home')->with('flash', 'アカウントと関連データがすべて削除されました');
    }

    /**
     * R2/S3 用 public URL を生成
     */
    private function getPublicUrl(string $path): string
    {
        // Laravel Cloud R2 は AWS_URL で始まる公開 URL が作れる
        return Storage::disk('s3')->url($path);
    }
}
