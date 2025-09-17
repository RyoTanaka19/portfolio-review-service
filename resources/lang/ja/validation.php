<?php

return [
    'required' => ':attribute は必須です。',
    'string' => ':attribute は文字列で入力してください。',
    'max' => [
        'string' => ':attribute は :max 文字以下で入力してください。',
    ],
    'confirmed' => ':attribute が確認用と一致しません。',
    'unique' => ':attribute は既に登録されています。',

    // フィールド名 → 表示名（平坦な配列）
    'attributes' => [
        // ユーザー登録フォーム
        'name' => '名前',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード（確認用）',

        // サービス作成フォーム
        'description' => 'サービス概要',
        'target_users' => 'ターゲットユーザー',
        'issues' => '悩み・相談内容',
    ],
];
