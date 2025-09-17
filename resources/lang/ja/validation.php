<?php

return [
    'required' => ':attribute は必須です。',
    'string' => ':attribute は文字列で入力してください。',
    'max' => [
        'string' => ':attribute は :max 文字以下で入力してください。',
    ],
    'confirmed' => ':attribute が確認用と一致しません。', // 追加

    'attributes' => [
        'name' => 'サービス名',
        'description' => 'サービス概要',
        'target_users' => 'ターゲットユーザー',
        'issues' => '悩み・相談内容',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード（確認用）',
    ],
];
