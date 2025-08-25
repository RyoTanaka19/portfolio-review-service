// resources/js/Pages/Portfolios/New.jsx
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function New() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("portfolio.store"), // サーバー側 create メソッドに合わせる
            { title, description, url },
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
