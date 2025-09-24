<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * プロフィール詳細表示
     */
    public function show(Request $request, User $user): Response
    {
        $user->load('tags');

        $user->profile_image_url = $user->profile_image
            ? Storage::disk('s3')->url($user->profile_image)
            : null;

        $allTags = Tag::where('type', 'user')->get();

        return Inertia::render('Profiles/Show', [
            'user' => $user,
            'allTags' => $allTags,
        ]);
    }

    /**
     * プロフィール編集ページ
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('tags');

        $user->profile_image_url = $user->profile_image
            ? Storage::disk('s3')->url($user->profile_image)
            : null;

        $allTags = Tag::where('type', 'user')->get();

        return Inertia::render('Profiles/Edit', [
            'user' => $user,
            'allTags' => $allTags,
            'mustVerifyEmail' => $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * プロフィール更新
     */
    public function update(\App\Http\Requests\ProfileUpdateRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();
        unset($data['profile_image'], $data['delete_profile_image'], $data['tags']);
        $user->fill($data);

        // プロフィール画像処理（公開アップロード）
        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('s3')->delete($user->profile_image);
            }
            // storePublicly に変更
            $path = $request->file('profile_image')->storePublicly('profile_images', 's3');
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

        $user->load('tags');
        $user->profile_image_url = $user->profile_image
            ? Storage::disk('s3')->url($user->profile_image)
            : null;

        return response()->json([
            'success' => true,
            'user' => $user,
            'message' => 'プロフィール情報を更新しました',
        ]);
    }
}
