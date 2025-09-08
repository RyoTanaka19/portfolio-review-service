import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";
import axios from "axios";

export default function Index({
    portfolios,
    auth,
    filters = {},
    allTags = [],
}) {
    const [userNameFilter, setUserNameFilter] = useState(
        filters.user_name || ""
    );
    const [tagFilter, setTagFilter] = useState(filters.tag || "");
    const [suggestions, setSuggestions] = useState([]);

    // ポートフォリオ一覧を state で保持（削除後に更新可能）
    const [portfolioList, setPortfolioList] = useState(portfolios);

    // ブックマーク状態を保持
    const initialBookmarks = {};
    portfolios.forEach((p) => {
        initialBookmarks[p.id] = p.is_bookmarked || false;
    });
    const [bookmarks, setBookmarks] = useState(initialBookmarks);

    // 削除処理
    const handleDelete = async (id) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await axios.delete(`/portfolio/${id}`);

            if (response.status === 200) {
                alert("ポートフォリオを削除しました");

                // 削除したカードだけ state から除外
                setPortfolioList((prev) => prev.filter((p) => p.id !== id));
            } else {
                alert(response.data.error || "削除に失敗しました");
            }
        } catch (error) {
            if (error.response) {
                alert(`削除に失敗しました: ${error.response.data.error}`);
            } else if (error.request) {
                alert("サーバーに接続できませんでした");
            } else {
                alert(`削除に失敗しました: ${error.message}`);
            }
            console.error(error);
        }
    };

    // 検索処理
    const handleSearch = () => {
        Inertia.get(
            route("dashboard"),
            { user_name: userNameFilter, tag: tagFilter },
            { preserveState: true }
        );
        setSuggestions([]);
    };

    // ブックマークの登録・解除
    const toggleBookmark = (portfolioId) => {
        const isBookmarked = bookmarks[portfolioId];

        if (isBookmarked) {
            Inertia.delete(route("bookmark.destroy", portfolioId), {
                onSuccess: () =>
                    setBookmarks((prev) => ({ ...prev, [portfolioId]: false })),
            });
        } else {
            Inertia.post(
                route("bookmark.store", portfolioId),
                {},
                {
                    onSuccess: () =>
                        setBookmarks((prev) => ({
                            ...prev,
                            [portfolioId]: true,
                        })),
                }
            );
        }
    };

    // ユーザー候補取得
    const fetchUserSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await axios.get("/autocomplete/users", {
                params: { query },
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("ユーザー候補取得エラー:", err);
            setSuggestions([]);
        }
    };

    const handleUserInput = (e) => {
        const value = e.target.value;
        setUserNameFilter(value);
        fetchUserSuggestions(value);
    };

    return (
        <AppLayout>
            <header className="px-8 py-6 bg-white shadow flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
                <div className="w-full max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* タグ検索 */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                タグで検索
                            </label>
                            <select
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">タグを選択</option>
                                {allTags.map((tag, idx) => (
                                    <option key={idx} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ユーザー名検索 */}
                        <div className="flex flex-col relative">
                            <label className="text-sm font-medium mb-1">
                                ユーザー名で検索
                            </label>
                            <input
                                type="text"
                                placeholder="例: Tanaka"
                                value={userNameFilter}
                                onChange={handleUserInput}
                                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute top-full mt-2 z-10 bg-white border w-full max-h-48 overflow-y-auto shadow rounded">
                                    {suggestions.map((user) => (
                                        <li
                                            key={user.id}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setUserNameFilter(user.name);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {user.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 検索ボタン */}
                        <div className="flex items-center mt-2 md:mt-0">
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                検索
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioList.map((p) => {
                    const averageRating = p.reviews?.length
                        ? (
                              p.reviews.reduce((sum, r) => sum + r.rating, 0) /
                              p.reviews.length
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

                            {p.image_url && (
                                <img
                                    src={p.image_url}
                                    alt={p.title}
                                    className="w-full h-40 object-cover mb-2 rounded"
                                />
                            )}

                            <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                                {p.description}
                            </p>

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

                            {p.tags?.length > 0 && (
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

                            {auth?.user && (
                                <button
                                    type="button"
                                    onClick={() => toggleBookmark(p.id)}
                                    className={`mt-2 px-2 py-1 rounded text-sm ${
                                        bookmarks[p.id]
                                            ? "bg-yellow-400 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {bookmarks[p.id]
                                        ? "★ お気に入り"
                                        : "☆ お気に入り"}
                                </button>
                            )}

                            {p.url && (
                                <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm block mt-2"
                                >
                                    サイトを見る→
                                </a>
                            )}

                            {auth?.user?.id === p.user_id && (
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
