import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AppLayout, { useFlash } from "@/Layouts/AppLayout"; // useFlashをインポート
import BookmarkButton from "@/Components/Bookmark/BookmarkButton";

export default function Index({ portfolios: initialPortfolios = [], auth }) {
    const [portfolioList, setPortfolioList] = useState(initialPortfolios);
    const { setFlash } = useFlash(); // useFlashからsetFlashを取得

    const handleBookmarkToggle = (portfolioId, isBookmarked, message) => {
        if (!isBookmarked) {
            // ブックマーク解除された場合 → リストから削除
            setPortfolioList((prev) =>
                prev.filter((p) => p.id !== portfolioId)
            );
        }

        // フラッシュメッセージを表示
        setFlash(message, "success"); // フラッシュメッセージをAppLayoutに渡す
    };

    return (
        <AppLayout>
            <header className="px-8 py-6 bg-white shadow flex justify-center">
                <h1 className="text-3xl font-bold">お気に入り一覧</h1>
            </header>

            <main className="px-4 py-8 max-w-6xl mx-auto">
                {portfolioList.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 text-lg font-medium">
                            お気に入りはまだありません
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolioList.map((p) => {
                            const averageRating = p.reviews?.length
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
                                            <Link
                                                href={`/portfolio/${p.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {p.title.length > 30
                                                    ? p.title.slice(0, 30) + "…"
                                                    : p.title}
                                            </Link>
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
                                                <span
                                                    key={idx}
                                                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {auth?.user && (
                                        <BookmarkButton
                                            portfolioId={p.id}
                                            initialBookmarked={true}
                                            onToggle={(isBookmarked, message) =>
                                                handleBookmarkToggle(
                                                    p.id,
                                                    isBookmarked,
                                                    message
                                                )
                                            }
                                        />
                                    )}

                                    {p.url && (
                                        <a
                                            href={p.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-sm block mt-2"
                                        >
                                            サイトを見る →
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </AppLayout>
    );
}
