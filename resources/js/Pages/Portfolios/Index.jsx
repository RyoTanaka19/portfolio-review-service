import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

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
                {/* ページタイトル */}
                <h1 className="text-2xl font-bold text-center flex-1">
                    投稿一覧画面
                </h1>

                {/* 投稿ボタン */}
                <a
                    href="/portfolio/create"
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    投稿
                </a>

                {/* 右上ユーザー情報 */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="font-medium text-gray-700 hover:text-gray-900"
                    >
                        {auth.user.name}
                    </button>

                    {/* ドロップダウン */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                            <a
                                href="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                プロフィール編集
                            </a>
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
                        <h2 className="font-bold text-lg">{p.title}</h2>
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

                        {/* 削除ボタン */}
                        <button
                            onClick={() => handleDelete(p.id)}
                            className="mt-2 ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </main>
        </div>
    );
}
