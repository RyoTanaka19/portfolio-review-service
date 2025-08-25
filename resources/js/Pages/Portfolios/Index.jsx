import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Index({ portfolios, auth }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    // 削除処理
    const handleDelete = (id) => {
        if (confirm("本当に削除しますか？")) {
            Inertia.delete(`/portfolio/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-center flex-1">
                    投稿一覧画面
                </h1>

                {/* 投稿ボタンとAI相談ボタン */}
                <div className="flex items-center ml-4">
                    <InertiaLink
                        href="/create"
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

            {/* コンテンツ */}
            <main className="px-8 py-6">
                {portfolios.map((p) => (
                    <div
                        key={p.id}
                        className="border p-4 mb-4 bg-white rounded shadow"
                    >
                        {/* タイトルをリンク化 */}
                        <InertiaLink
                            href={`/portfolio/${p.id}`}
                            className="font-bold text-lg text-blue-500 hover:underline"
                        >
                            {p.title}
                        </InertiaLink>

                        <p className="mt-2">{p.description}</p>
                        {p.url && (
                            <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 mt-2 inline-block"
                            >
                                Visit
                            </a>
                        )}

                        {/* 削除・編集ボタン：自分の投稿のみ */}
                        {p.user_id === auth.user.id && (
                            <div className="mt-2">
                                {/* 編集ボタン */}
                                <InertiaLink
                                    href={`/portfolio/${p.id}/edit`}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                >
                                    編集
                                </InertiaLink>

                                {/* 削除ボタン */}
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
