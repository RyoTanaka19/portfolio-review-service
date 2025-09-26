<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Portfolio;
use App\Models\Tag; // 追加
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

        // タグをロード
        $user->load('tags');

        // プロフィール画像URLをS3に対応
        $user->profile_image_url = $user->profile_image
            ? Storage::disk('s3')->url($user->profile_image) // S3 URLを取得
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

        // ポートフォリオ画像URLをS3に対応
        $portfolios = $portfolios->map(function ($p) {
            $p->image_url = $p->image_path ? Storage::disk('s3')->url($p->image_path) : null; // S3 URLを取得
            return $p;
        });

        // プロフィール画像URLをS3に対応
        $user->profile_image_url = $user->profile_image
            ? Storage::disk('s3')->url($user->profile_image) // S3 URLを取得
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
            // validated データを取得し、画像関連・タグを除外して fill
            $data = $request->validated();
            unset($data['profile_image'], $data['delete_profile_image'], $data['tags']);
            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // プロフィール画像アップロード
            if ($request->hasFile('profile_image')) {
                // 古いプロフィール画像がある場合は削除
                if ($user->profile_image) {
                    Storage::disk('s3')->delete($user->profile_image); // 's3'を使用
                }

                // 新しいプロフィール画像をS3にアップロード
                $path = $request->file('profile_image')->store('profile_images', 's3'); // 's3'ディスクを使用
                $user->profile_image = $path;
            } elseif ($request->boolean('delete_profile_image')) {
                // プロフィール画像を削除
                if ($user->profile_image) {
                    Storage::disk('s3')->delete($user->profile_image); // 's3'を使用
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
                ? Storage::disk('s3')->url($user->profile_image) // 's3'を使用
                : null;

            // JSON で返す
            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'プロフィール情報を更新しました',
            ]);
        } catch (\Throwable $e) {
            // エラー時
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
        // 1. パスワード確認
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // 2. ログアウト
        Auth::logout();

        // 3. ユーザーが作成したポートフォリオの画像削除
        foreach ($user->portfolios as $portfolio) {
            if ($portfolio->image_path) {
                Storage::disk('s3')->delete($portfolio->image_path); // 's3'を使用
            }
        }

        // 4. ユーザーが作成したレビューの画像削除（もし画像がある場合）
        foreach ($user->reviews as $review) {
            if (isset($review->image_path) && $review->image_path) {
                Storage::disk('s3')->delete($review->image_path); // 's3'を使用
            }
        }

        // 5. ユーザーが作成したブックマークの画像削除（もし画像がある場合）
        foreach ($user->bookmarks as $bookmark) {
            if (isset($bookmark->image_path) && $bookmark->image_path) {
                Storage::disk('s3')->delete($bookmark->image_path); // 's3'を使用
            }
        }

        // 6. プロフィール画像削除
        if ($user->profile_image) {
            Storage::disk('s3')->delete($user->profile_image); // 's3'を使用
        }

        // 7. ユーザー削除
        // cascade設定により、portfolios/reviews/bookmarks の DB レコードも自動削除
        $user->delete();

        // 8. セッション無効化
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 9. フラッシュメッセージとリダイレクト
        return Redirect::route('home')->with('flash', 'アカウントと関連データがすべて削除されました');
    }
}
