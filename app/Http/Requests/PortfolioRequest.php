<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PortfolioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 新規作成はログインユーザーならOK
        if ($this->isMethod('post')) {
            return auth()->check();
        }

        // 更新の場合は対象ポートフォリオの所有者であること
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $portfolio = $this->route('portfolio'); // route パラメータ名に注意
            return $portfolio && $portfolio->user_id === auth()->id();
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'required|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'tags' => 'required|array',
            'tags.*' => 'string|max:50',
            'image' => 'nullable|image|max:2048',
            'delete_image' => 'nullable|boolean',
        ];
    }
}
