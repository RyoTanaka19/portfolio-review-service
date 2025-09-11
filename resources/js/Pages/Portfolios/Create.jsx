// resources/js/Pages/Portfolios/Create.jsx
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import TagsInput from "@/Components/Tags/TagsInput";

export default function Create() {
    const { errors: serverErrors } = usePage().props; // Laravel バリデーションエラー
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    // サーバーからのエラーを state に反映
    useEffect(() => {
        setErrors(serverErrors || {});
    }, [serverErrors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // クライアント側バリデーション
        const newErrors = {};
        if (!title.trim()) newErrors.title = "タイトルは必須です";
        if (!description.trim()) newErrors.description = "説明は必須です";
        if (!url.trim()) newErrors.url = "URLは必須です";
        if (tags.length === 0) newErrors.tags = "タグは必須です";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("url", url);
        formData.append("github_url", githubUrl);
        tags.forEach((t, idx) => formData.append(`tags[${idx}]`, t.name));
        if (image) formData.append("image", image);

        Inertia.post(route("portfolios.store"), formData, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout>
            <div className="flex justify-center items-center py-6 bg-gray-50 min-h-screen">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        新規投稿
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md"
                        encType="multipart/form-data"
                    >
                        {/* タイトル */}
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

                        {/* 説明 */}
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

                        {/* 画像 */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                画像 (任意)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full"
                            />
                        </div>

                        {/* URL */}
                        <div className="mb-4">
                            <label className="block font-medium mb-1">
                                作品URL <span className="text-red-500">*</span>
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
                                GitHub URL (任意)
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
                                タグ <span className="text-red-500">*</span>
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
