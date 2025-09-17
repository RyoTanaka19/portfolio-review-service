<?php

return [
    'required' => ':attribute は必須です。',
    'string' => ':attribute は文字列で入力してください。',
    'max' => [
        'string' => ':attribute は :max 文字以下で入力してください。',
    ],
    'confirmed' => ':attribute が確認用と一致しません。',
    'unique' => ':attribute は既に登録されています。',

    // 属性ごとにフォームタイプ別に定義
    'attributes' => [
        // ユーザー登録フォーム用
        'user' => [
            'name' => '名前',
            'email' => 'メールアドレス',
            'password' => 'パスワード',
            'password_confirmation' => 'パスワード（確認用）',
        ],

        // サービス作成フォーム用
        'service' => [
            'name' => 'サービス名',
            'description' => 'サービス概要',
            'target_users' => 'ターゲットユーザー',
            'issues' => '悩み・相談内容',
        ],
    ],
];
