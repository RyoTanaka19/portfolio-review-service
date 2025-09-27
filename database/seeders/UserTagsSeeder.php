<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class UserTagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            '学生',
            '社会人',
            '主婦',
            'プログラミング初学者',
            'デザイナー',
            'スポーツが好き',
            '音楽が好き',
            '読書好き',
            '旅行好き',
            '映画好き',
            'ゲーム好き',
            '料理好き',
            '写真好き',
            'アート好き',
            'カフェ巡り好き'
        ];
        
        foreach ($tags as $tag) {
            Tag::firstOrCreate([
                'name' => $tag,
                'type' => 'user',
            ]);
        }
    }
}
