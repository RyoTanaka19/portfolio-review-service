// resources/js/Pages/Portfolios/Edit.jsx
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import TagsInput from "../Tags/Index";

export default function Edit({ portfolio }) {
    const { errors: serverErrors } = usePage().props;

    const [title, setTitle] = useState(portfolio.title);
    const [description, setDescription] = useState(portfolio.description);
    const [url, setUrl] = useState(portfolio.url || "");
    const [githubUrl, setGithubUrl] = useState(portfolio.github_url || "");
    const [tags, setTags] = useState(portfolio.tags.map((name) => ({ name })));
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        portfolio.image_url || null
    );

    // サーバーからのエラーを日本語に変換して反映
    const mapErrorsToJapanese = (errors) => {
        const newErrors = {};
        for (const key in errors) {
            let msg = errors[key];

            // 英語メッセージを日本語に置換
            if (msg === "The description field is required.") {
                msg = "作品説明は必須です";
            }
            if (msg === "The title field is required.") {
                msg = "作品タイトルは必須です";
            }
            if (msg === "The url field is required.") {
                msg = "作品のURLは必須です";
            }
            if (msg === "The tags field is required.") {
                msg = "タグ（技術）は必須です";
            }
            // 他のカスタムエラーもここで追加可能

            newErrors[key] = msg;
        }
        return newErrors;
    };

    const [errors, setErrors] = useState(
        mapErrorsToJapanese(serverErrors || {})
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(
            file ? URL.createObjectURL(file) : portfolio.image_url || null
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // クライアント側バリデーション
        const newErrors = {};
        if (!title.trim()) newErrors.title = "作品タイトルは必須です";
        if (!url.trim()) newErrors.url = "作品のURLは必須です";
        if (tags.length === 0) newErrors.tags = "タグ（技術）は必須です";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("title", title);
        formData.append("description", description);
        formData.append("url", url);
        formData.append("github_url", githubUrl);
        tags.forEach((t, index) => formData.append(`tags[${index}]`, t.name));
        if (image) formData.append("image", image);

        Inertia.post(`/portfolios/${portfolio.id}`, formData, {
            onError: (err) => setErrors(mapErrorsToJapanese(err)),
            preserveScroll: true,
            preserveState: true,
        });
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
                        encType="multipart/form-data"
                    >
                        {/* 作品タイトル */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                作品タイトル{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full border px-3 py-2 rounded ${
                                    errors.title ? "border-red-500" : ""
                                }`}
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
                                作品説明 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`w-full border px-3 py-2 rounded ${
                                    errors.description ? "border-red-500" : ""
                                }`}
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

                        {/* 作品のURL */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                作品のURL{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className={`w-full border px-3 py-2 rounded ${
                                    errors.url ? "border-red-500" : ""
                                }`}
                            />
                            {errors.url && (
                                <p className="text-red-500 mt-1">
                                    {errors.url}
                                </p>
                            )}
                        </div>

                        {/* GitHub URL */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                GitHubのリポジトリURL（任意）
                            </label>
                            <input
                                type="url"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                className="w-full border px-3 py-2 rounded"
                            />
                            {errors.github_url && (
                                <p className="text-red-500 mt-1">
                                    {errors.github_url}
                                </p>
                            )}
                        </div>

                        {/* タグ */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                タグ（技術）{" "}
                                <span className="text-red-500">*</span>
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
                            更新
                        </button>

                        <div className="text-center mt-8">
                            <Link
                                href="/portfolios"
                                className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                一覧に戻る
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
