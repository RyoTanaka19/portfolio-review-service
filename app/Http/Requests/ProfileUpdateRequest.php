<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            // プロフィール画像（任意、画像ファイル、2MBまで）
            'profile_image' => ['nullable', 'image', 'max:2048'],
            // 削除フラグ（チェックボックスやフロントから送られる場合）
            'delete_profile_image' => ['sometimes', 'boolean'],
            'git_url' => ['nullable', 'url', 'max:255']
        ];
    }
}
