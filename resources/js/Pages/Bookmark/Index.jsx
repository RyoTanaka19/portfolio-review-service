import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import BookmarkButton from "@/Components/Bookmark/BookmarkButton";
import FlashMessage from "@/Components/FlashMessage";

export default function Index({ portfolios: initialPortfolios = [], auth }) {
    const [portfolioList, setPortfolioList] = useState(initialPortfolios);
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashType, setFlashType] = useState("success");

    const handleBookmarkToggle = (portfolioId, isBookmarked, message) => {
        if (!isBookmarked) {
            // ブックマーク解除された場合 → リストから削除
            setPortfolioList((prev) =>
                prev.filter((p) => p.id !== portfolioId)
            );
        }

        // フラッシュメッセージ（常に緑色で表示）
        setFlashMessage(message);
        setFlashType("success");
    };

    return (
        <AppLayout>
            <header className="px-8 py-6 bg-white shadow flex justify-center">
                <h1 className="text-3xl font-bold">お気に入り一覧</h1>
            </header>

            {/* フラッシュメッセージ */}
            <FlashMessage
                message={flashMessage}
                type={flashType}
                onClose={() => setFlashMessage(null)}
            />

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
                                        {/* タイトルを中央寄せ */}
                                        <h2 className="font-bold text-lg truncate text-center w-full">
                                            <Link
                                                href={`/portfolio/${p.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {p.title.length > 30
                                                    ? p.title.slice(0, 30) + "…"
                                                    : p.title}
                                            </Link>
                                        </h2>
                                    </div>

                                    {p.image_url && (
                                        <img
                                            src={p.image_url}
                                            alt={p.title}
                                            className="w-full h-40 object-cover mb-2 rounded"
                                        />
                                    )}

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

                                    {p.service_url && (
                                        <a
                                            href={p.service_url}
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
