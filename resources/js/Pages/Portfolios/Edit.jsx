import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Edit({ portfolio }) {
    const [title, setTitle] = useState(portfolio.title);
    const [description, setDescription] = useState(portfolio.description);
    const [url, setUrl] = useState(portfolio.url || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.put(`/portfolio/${portfolio.id}`, {
            title,
            description,
            url,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-6">
            <h1 className="text-2xl font-bold mb-4">ポートフォリオ編集</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md"
            >
                <div className="mb-4">
                    <label className="block font-medium mb-1">タイトル</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">説明</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

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
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    更新
                </button>

                <InertiaLink
                    href="/portfolio"
                    className="ml-4 text-gray-700 hover:underline"
                >
                    キャンセル
                </InertiaLink>
            </form>
        </div>
    );
}
