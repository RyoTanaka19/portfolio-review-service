// resources/js/Components/Portfolios/PortfolioForm.jsx
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import TagsInput from "@/Components/Tags/TagsInput";

export default function Form({
    initialData = {}, // title, description, url, github_url, tags, image_url
    onSubmitRoute, // 送信先 route 文字列
    method = "post", // HTTPメソッド ("post" or "put")
    buttonText = "投稿", // ボタンテキスト
}) {
    const [title, setTitle] = useState(initialData.title || "");
    const [description, setDescription] = useState(
        initialData.description || ""
    );
    const [url, setUrl] = useState(initialData.url || "");
    const [githubUrl, setGithubUrl] = useState(initialData.github_url || "");
    const [tags, setTags] = useState(
        (initialData.tags || []).map((name) => ({ name }))
    );
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialData.image_url || null
    );
    const [errors, setErrors] = useState({});

    // 画像プレビュー更新
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(
            file ? URL.createObjectURL(file) : initialData.image_url || null
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // クライアント側バリデーション
        const newErrors = {};
        if (!title.trim()) newErrors.title = "作品タイトルは必須です";
        if (!description.trim()) newErrors.description = "作品説明は必須です"; // ←追加
        if (!url.trim()) newErrors.url = "作品のURLは必須です";
        if (tags.length === 0) newErrors.tags = "タグ（技術）は必須です";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // FormData 作成
        const formData = new FormData();
        if (method.toLowerCase() === "put") formData.append("_method", "put");
        formData.append("title", title);
        formData.append("description", description); // ←必須
        formData.append("url", url);
        formData.append("github_url", githubUrl);
        tags.forEach((t, idx) => formData.append(`tags[${idx}]`, t.name));
        if (image) formData.append("image", image);

        Inertia.post(onSubmitRoute, formData, {
            onError: (err) => setErrors(err),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white p-6 rounded shadow-md"
        >
            {/* タイトル */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    作品タイトル <span className="text-red-500">*</span>
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
                    <p className="text-red-500 mt-1">{errors.title}</p>
                )}
            </div>

            {/* 説明 */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    作品説明<span className="text-red-500">*</span>
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
                    <p className="text-red-500 mt-1">{errors.description}</p>
                )}
            </div>

            {/* 画像 */}
            <div className="mb-4">
                <label className="block font-medium mb-1">画像（任意）</label>
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
                    <p className="text-red-500 mt-1">{errors.image}</p>
                )}
            </div>

            {/* URL */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    作品のURL <span className="text-red-500">*</span>
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
                    <p className="text-red-500 mt-1">{errors.url}</p>
                )}
            </div>

            {/* GitHub URL */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    GitHub URL（任意）
                </label>
                <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
            </div>

            {/* タグ */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    タグ（技術） <span className="text-red-500">*</span>
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
                {buttonText}
            </button>
        </form>
    );
}
