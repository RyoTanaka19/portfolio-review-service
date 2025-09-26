import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import TagsInput from "@/Components/Tag/TagsInput";

export default function PortfolioForm({
    initialData = {}, // title, description, service_url, github_url, tags
    onSubmitRoute,
    method = "post",
    buttonText = "投稿",
}) {
    const [title, setTitle] = useState(initialData.title || "");
    const [description, setDescription] = useState(
        initialData.description || ""
    );
    const [serviceUrl, setServiceUrl] = useState(initialData.service_url || "");
    const [githubUrl, setGithubUrl] = useState(initialData.github_url || "");
    const [tags, setTags] = useState(
        (initialData.tags || []).map((name) => ({ name }))
    );
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // クライアント側バリデーション
        const newErrors = {};
        if (!title.trim()) newErrors.title = "作品タイトルは必須です";
        if (!description.trim()) newErrors.description = "作品説明は必須です";
        if (!serviceUrl.trim()) newErrors.service_url = "作品のURLは必須です";
        if (tags.length === 0) newErrors.tags = "タグ（技術）は必須です";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // FormData 作成
        const formData = new FormData();
        if (method.toLowerCase() === "put") formData.append("_method", "put");
        formData.append("title", title);
        formData.append("description", description);
        formData.append("service_url", serviceUrl);
        formData.append("github_url", githubUrl);
        tags.forEach((t, idx) => formData.append(`tags[${idx}]`, t.name));

        Inertia.post(onSubmitRoute, formData, {
            onError: (err) => setErrors(err),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto"
        >
            {/* タイトル */}
            <div className="mb-6">
                <label className="block font-semibold text-lg mb-2">
                    作品タイトル <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full border-2 px-4 py-3 rounded-lg shadow-sm ${
                        errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.title && (
                    <p className="text-red-500 mt-2 text-sm">{errors.title}</p>
                )}
            </div>

            {/* 説明 */}
            <div className="mb-6">
                <label className="block font-semibold text-lg mb-2">
                    作品説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full border-2 px-4 py-3 rounded-lg shadow-sm ${
                        errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    rows={5}
                />
                {errors.description && (
                    <p className="text-red-500 mt-2 text-sm">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* service_url  */}
            <div className="mb-6">
                <label className="block font-semibold text-lg mb-2">
                    作品のURL <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    value={serviceUrl}
                    onChange={(e) => setServiceUrl(e.target.value)}
                    className={`w-full border-2 px-4 py-3 rounded-lg shadow-sm ${
                        errors.service_url
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                />
                {errors.service_url && (
                    <p className="text-red-500 mt-2 text-sm">
                        {errors.service_url}
                    </p>
                )}
            </div>

            {/* GitHub URL */}
            <div className="mb-6">
                <label className="block font-semibold text-lg mb-2">
                    GitHub URL（任意）
                </label>
                <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full border-2 px-4 py-3 rounded-lg shadow-sm border-gray-300"
                />
            </div>

            {/* タグ */}
            <div className="mb-6">
                <label className="block font-semibold text-lg mb-2">
                    タグ（技術） <span className="text-red-500">*</span>
                </label>
                <TagsInput value={tags} onChange={setTags} />
                {errors.tags && (
                    <p className="text-red-500 mt-2 text-sm">{errors.tags}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
                {buttonText}
            </button>
        </form>
    );
}
