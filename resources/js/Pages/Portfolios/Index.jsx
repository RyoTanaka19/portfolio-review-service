import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react"; // InertiaLink → Link
import AppLayout from "@/Layouts/AppLayout";
import axios from "axios";
import BookmarkButton from "@/Components/BookmarkButton";
import PortfolioSearch from "@/Components/PortfolioSearch";

export default function Index({
    portfolios,
    auth,
    filters = {},
    allTags = [],
    flash = {},
}) {
    const [portfolioList, setPortfolioList] = useState(portfolios);
    const [flashMessage, setFlashMessage] = useState({
        success: flash.success || null,
        error: flash.error || null,
    });
    const [showFlash, setShowFlash] = useState(
        !!flash.success || !!flash.error
    );

    useEffect(() => {
        if (flashMessage.success || flashMessage.error) {
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const handleDelete = async (id) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await axios.delete(`/portfolio/${id}`);
            if (response.status === 200 && response.data.success) {
                setPortfolioList((prev) => prev.filter((p) => p.id !== id));
                setFlashMessage({
                    success: response.data.message,
                    error: null,
                });
                setShowFlash(true);
            } else {
                setFlashMessage({
                    success: null,
                    error: response.data.error || "削除に失敗しました",
                });
                setShowFlash(true);
            }
        } catch (error) {
            console.error(error);
            setFlashMessage({ success: null, error: "削除に失敗しました" });
            setShowFlash(true);
        }
    };

    return (
        <AppLayout>
            {/* フラッシュメッセージ */}
            {showFlash && (flashMessage.success || flashMessage.error) && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-3 rounded shadow-lg text-center ${
                        flashMessage.success
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {flashMessage.success || flashMessage.error}
                </div>
            )}

            {/* 検索フォーム */}
            <div className="px-4 py-6 bg-white shadow mb-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    投稿一覧
                </h1>
                <PortfolioSearch allTags={allTags} filters={filters} />
            </div>

            {/* ポートフォリオ一覧 */}
            <main className="px-4 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            className="bg-white flex flex-col h-full rounded shadow hover:shadow-lg transition duration-200"
                        >
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    {/* タイトル */}
                                    <Link
                                        href={`/portfolio/${p.id}`}
                                        className="font-bold text-lg text-blue-500 hover:underline truncate max-w-[70%]"
                                    >
                                        {p.title.length > 30
                                            ? p.title.slice(0, 30) + "…"
                                            : p.title}
                                    </Link>

                                    {/* ユーザー名リンク */}
                                    <Link
                                        href={`/profile/${p.user_id}`}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        {p.user_name}
                                    </Link>
                                </div>

                                {p.image_url && (
                                    <img
                                        src={p.image_url}
                                        alt={p.title}
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                )}

                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
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
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {p.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs cursor-default"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {p.url && (
                                    <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-sm mb-2"
                                    >
                                        サイトを見る→
                                    </a>
                                )}

                                {auth?.user && (
                                    <BookmarkButton
                                        portfolioId={p.id}
                                        initialBookmarked={
                                            p.is_bookmarked || false
                                        }
                                        setFlashMessage={setFlashMessage}
                                        setShowFlash={setShowFlash}
                                    />
                                )}
                            </div>

                            {auth?.user?.id === p.user_id && (
                                <div className="px-4 pb-4 flex justify-end gap-2 mt-auto">
                                    <Link
                                        href={`/portfolios/${p.id}/edit`}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                    >
                                        編集
                                    </Link>
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
