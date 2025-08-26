import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Index({ portfolios, auth }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    const handleDelete = (id) => {
        if (confirm("本当に削除しますか？")) {
            Inertia.delete(`/portfolio/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold flex-1 text-center">
                    投稿一覧
                </h1>

                <div className="flex items-center ml-4">
                    <InertiaLink
                        href="advice/create"
                        className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        AI相談
                    </InertiaLink>

                    <InertiaLink
                        href="/portfolio/create"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        投稿
                    </InertiaLink>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="font-medium text-gray-700 hover:text-gray-900"
                    >
                        {auth.user.name}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                            <InertiaLink
                                href="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                プロフィール編集
                            </InertiaLink>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                ログアウト
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* 投稿一覧 */}
            <main className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white p-4 rounded shadow hover:shadow-md transition duration-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold text-lg truncate">
                                <InertiaLink
                                    href={`/portfolio/${p.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {p.title.length > 30
                                        ? p.title.slice(0, 30) + "…"
                                        : p.title}
                                </InertiaLink>
                            </h2>
                            <span className="text-sm text-gray-500">
                                {p.user_name}
                            </span>
                        </div>

                        <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                            {p.description}
                        </p>

                        {p.url && (
                            <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-sm"
                            >
                                Visit
                            </a>
                        )}

                        {p.user_id === auth.user.id && (
                            <div className="mt-4 flex justify-end space-x-2">
                                <InertiaLink
                                    href={`/portfolio/${p.id}/edit`}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                >
                                    編集
                                </InertiaLink>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                    削除
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
}
