import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AppLayout from "@/Layouts/AppLayout";
import TagsInput from "../Tags/Index";

export default function Create() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("url", url);

        // タグ送信
        tags.forEach((t, index) => formData.append(`tags[${index}]`, t.name));

        // 画像送信
        if (image) {
            console.log("送信する画像:", image); // デバッグ用
            formData.append("image", image);
        }

        Inertia.post(route("portfolio.store"), formData, {
            onError: (err) => {
                console.log("送信エラー:", err);
                setErrors(err);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout>
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-6">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        新規投稿
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md"
                        encType="multipart/form-data" // 🔹 追加
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
                                <p className="text-red-500 mt-1">
                                    {errors.title}
                                </p>
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

                        {/* 画像アップロード */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                画像（任意）
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full"
                            />
                            {errors.image && (
                                <p className="text-red-500 mt-1">
                                    {errors.image}
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
                                <p className="text-red-500 mt-1">
                                    {errors.url}
                                </p>
                            )}
                        </div>

                        {/* タグ */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                タグ（技術）
                            </label>
                            <TagsInput value={tags} onChange={setTags} />
                            {errors.tags && (
                                <p className="text-red-500 mt-1">
                                    {errors.tags}
                                </p>
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
        </AppLayout>
    );
}
