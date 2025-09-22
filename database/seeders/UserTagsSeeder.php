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
        $tags = ['学生', '社会人', 'エンジニア', 'フリーランス', 'デザイナー'];
        
        foreach ($tags as $tag) {
            Tag::firstOrCreate([
                'name' => $tag,
                'type' => 'user',
            ]);
        }
    }
}
