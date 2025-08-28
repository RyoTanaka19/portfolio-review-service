// resources/js/Pages/Portfolio/Index.jsx
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Index({ portfolios, auth, filters = {} }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userNameFilter, setUserNameFilter] = useState(
        filters.user_name || ""
    );
    const [tagFilter, setTagFilter] = useState(filters.tag || "");

    const handleLogout = () => {
        Inertia.post("/logout");
    };

    const handleDelete = (id) => {
        if (confirm("本当に削除しますか？")) {
            Inertia.delete(`/portfolio/${id}`);
        }
    };

    const handleSearch = () => {
        Inertia.get(
            route("dashboard"),
            { user_name: userNameFilter, tag: tagFilter },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout>
            {/* ページヘッダー */}
            <header className="px-8 py-4 bg-white shadow flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>

                {/* 検索フォーム */}
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="ユーザー名で検索"
                        value={userNameFilter}
                        onChange={(e) => setUserNameFilter(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="タグで検索"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        検索
                    </button>
                </div>
            </header>

            {/* 投稿一覧 */}
            <main className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((p) => {
                    // 平均評価計算（レビューがある場合）
                    const averageRating =
                        p.reviews && p.reviews.length > 0
                            ? (
                                  p.reviews.reduce(
                                      (sum, r) => sum + r.rating,
                                      0
                                  ) / p.reviews.length
                              ).toFixed(1)
                            : null;

                    return (
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

                            {/* 平均評価 */}
                            {averageRating ? (
                                <p className="text-yellow-600 font-semibold mb-2">
                                    平均評価: {averageRating} / 5 (
                                    {p.reviews.length}件)
                                </p>
                            ) : (
                                <p className="text-gray-500 mb-2">
                                    レビューはまだありません
                                </p>
                            )}

                            {/* タグ表示 */}
                            {p.tags && p.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {p.tags.map((tag, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setTagFilter(tag);
                                                setUserNameFilter("");
                                                handleSearch();
                                            }}
                                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}

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
                                        type="button"
                                        onClick={() => handleDelete(p.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </main>
        </AppLayout>
    );
}
