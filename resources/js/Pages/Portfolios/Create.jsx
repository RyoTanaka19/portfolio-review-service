import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
// import TagsInput のパスはプロジェクト構成に合わせてください。
// 例: resources/js/Pages/Tags/Index.jsx に置いたなら相対パスは "../Tags/Index"
import TagsInput from "../Tags/Index";

export default function Create() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState([]); // ここで選択タグを管理
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("portfolio.store"),
            {
                title,
                description,
                url,
                // サーバ側は名前配列 (["Ruby","PHP"]) を受け取る想定
                tags: tags.map((t) => t.name),
            },
            {
                onError: (err) => setErrors(err),
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    新規投稿
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow-md"
                >
                    {/* 作品タイトル */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            作品タイトル
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.title && (
                            <p className="text-red-500 mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* 作品説明 */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            作品説明
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-red-500 mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* 任意URL */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            任意URL
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.url && (
                            <p className="text-red-500 mt-1">{errors.url}</p>
                        )}
                    </div>

                    {/* タグ入力コンポーネント */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            タグ（技術）
                        </label>
                        <TagsInput value={tags} onChange={setTags} />
                        {errors.tags && (
                            <p className="text-red-500 mt-1">{errors.tags}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        投稿
                    </button>
                </form>
            </div>
        </div>
    );
}
