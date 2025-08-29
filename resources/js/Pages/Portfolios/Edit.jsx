import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import TagsInput from "../Tags/Index";

export default function Edit({ portfolio, errors: serverErrors = {} }) {
    const [title, setTitle] = useState(portfolio.title);
    const [description, setDescription] = useState(portfolio.description);
    const [url, setUrl] = useState(portfolio.url || "");
    const [tags, setTags] = useState(portfolio.tags.map((name) => ({ name })));
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        portfolio.image_url || `/storage/${portfolio.image_path}` || null
    );
    const [errors, setErrors] = useState(serverErrors);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(
                portfolio.image_url ||
                    `/storage/${portfolio.image_path}` ||
                    null
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            `/portfolio/${portfolio.id}`,
            {
                _method: "put", // ← Laravel の update ルートに通す
                title,
                description,
                url,
                tags: tags.map((t) => t.name),
                image,
            },
            {
                forceFormData: true, // ← 必須
                onError: (err) => setErrors(err),
            }
        );
    };

    return (
        <AppLayout>
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-6">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        ポートフォリオ編集
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md"
                    >
                        {/* タイトル */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                タイトル
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            {errors.title && (
                                <p className="text-red-500 mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* 説明 */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                説明
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* URL */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                URL（任意）
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

                        {/* 画像アップロード */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                画像（任意）
                            </label>
                            {imagePreview && (
                                <div className="mb-2">
                                    <img
                                        src={imagePreview}
                                        alt="プレビュー"
                                        className="w-full max-w-xs object-cover rounded"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {image ? image.name : "現在の画像"}
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full"
                            />
                            {errors.image && (
                                <p className="text-red-500 mt-1">
                                    {errors.image}
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

                        {/* ボタン */}
                        <div className="flex items-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                更新
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
