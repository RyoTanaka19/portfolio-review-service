<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            // 言語
            'Ruby', 'Python', 'Java', 'PHP', 'JavaScript', 'TypeScript', 'Go', 'C#', 'C++', 

            // フレームワーク・ライブラリ
            'Ruby on Rails', 'Laravel', 'Django', 'Spring', 'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Flutter',

            // フロントエンド関連
            'HTML', 'CSS', 'TailwindCSS', 'Sass', 'Bootstrap', 

            // データベース・インフラ
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 

            // その他
            'Git', 'CI/CD', 'REST API', 'GraphQL'
        ];

        foreach ($tags as $name) {
            Tag::firstOrCreate(['name' => $name]);
        }
    }
}
