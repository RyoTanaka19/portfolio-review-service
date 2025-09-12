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

        // 画像URLを付与
        $user->profile_image_url = $user->profile_image
            ? asset('storage/' . $user->profile_image)
            : null;

        // 全てのタグを取得
        $allTags = Tag::where('type', 'user')->get();

        return Inertia::render('Profile/Edit', [
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
        $p->image_url = $p->image_path ? asset('storage/' . $p->image_path) : null;
        return $p;
    });

    // プロフィール画像URLを付与
    $user->profile_image_url = $user->profile_image
        ? asset('storage/' . $user->profile_image)
        : null;

    return Inertia::render('Profile/Show', [
        'user' => $user,
        'authUserId' => $authUserId,
        'portfolios' => $portfolios,
    ]);
}

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // validated データを取得し、画像関連・タグを除外して fill
        $data = $request->validated();
        unset($data['profile_image'], $data['delete_profile_image'], $data['tags']);
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // プロフィール画像アップロード
        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
        } elseif ($request->boolean('delete_profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $user->profile_image = null;
        }

        $user->save();

        // タグ更新
        $tagIds = $request->input('tags', []);
        $user->tags()->sync($tagIds);

        return Redirect::route('profile.edit');
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

        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
