<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        // 既存のタグを全削除
        Tag::truncate();

        // 新しく登録したいタグ一覧
        $tags = [
            // 言語
            'Ruby', 'Python', 'Java', 'PHP', 'JavaScript', 'TypeScript',

            // フレームワーク・ライブラリ
            'Ruby on Rails', 'Laravel', 'Django', 'Spring', 'React', 'Vue.js', 'Next.js',

            // フロントエンド関連
            'HTML', 'CSS', 'TailwindCSS', 'Bootstrap',

            // データベース・インフラ
            'MySQL', 'PostgreSQL', 'Docker', 'AWS',

            // その他
            'Git',
        ];

        // 新しいタグを作成
        foreach ($tags as $name) {
            Tag::create(['name' => $name]);
        }
    }
}
