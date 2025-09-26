import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import BookmarkButton from "@/Components/Bookmark/BookmarkButton";
import FlashMessage from "@/Components/FlashMessage";

export default function Show() {
    const { props } = usePage();
    const { user, authUserId, portfolios = [] } = props;

    const [flashMessage, setFlashMessage] = useState({
        message: null,
        type: null,
    });

    const isOwnProfile = authUserId === user.id;

    return (
        <AppLayout auth={{ user: { id: authUserId } }}>
            <Head title={`${user.name} のプロフィール`} />

            {/* フラッシュメッセージ */}
            <FlashMessage
                message={flashMessage.message}
                type={flashMessage.type}
                onClose={() => setFlashMessage({ message: null, type: null })}
            />

            <div className="p-6 max-w-7xl mx-auto">
                {/* プロフィールカード */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        {isOwnProfile && (
                            <p className="text-gray-600 mb-2">
                                メールアドレス: {user.email}
                            </p>
                        )}
                        <p className="text-gray-500 text-sm">
                            投稿したポートフォリオ数:{" "}
                            <span className="font-semibold">
                                {portfolios.length}
                            </span>
                        </p>
                        {user.tags?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {user.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ポートフォリオ一覧 */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                        {isOwnProfile
                            ? "あなたの投稿したポートフォリオ"
                            : `${user.name} さんの投稿したポートフォリオ`}
                    </h2>

                    {portfolios.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolios.map((p) => {
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
                                        className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col overflow-hidden"
                                    >
                                        {p.image_url && (
                                            <Link href={`/portfolio/${p.id}`}>
                                                <img
                                                    src={p.image_url}
                                                    alt={p.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            </Link>
                                        )}

                                        <div className="p-5 flex flex-col flex-1">
                                            <Link
                                                href={`/portfolio/${p.id}`}
                                                className="font-bold text-xl text-blue-600 hover:underline mb-2 truncate"
                                            >
                                                {p.title}
                                            </Link>

                                            <div className="mb-2 text-sm text-gray-500">
                                                作者:{" "}
                                                <Link
                                                    href={`/profile/${p.user_id}`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {p.user_name}
                                                </Link>
                                            </div>

                                            <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                                                {p.description}
                                            </p>

                                            {averageRating && (
                                                <p className="text-yellow-600 font-semibold mb-3">
                                                    ⭐ {averageRating} / 5 (
                                                    {p.reviews.length}件)
                                                </p>
                                            )}

                                            {p.service_url && (
                                                <a
                                                    href={p.service_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 text-sm mb-3 hover:underline"
                                                >
                                                    サイトを見る →
                                                </a>
                                            )}

                                            {p.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {p.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {isOwnProfile && (
                                                <div className="mt-3">
                                                    <BookmarkButton
                                                        portfolioId={p.id}
                                                        initialBookmarked={
                                                            p.is_bookmarked ||
                                                            false
                                                        }
                                                        onToggle={(_, msg) =>
                                                            setFlashMessage({
                                                                message: msg,
                                                                type: "success",
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <svg
                                className="w-16 h-16 text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 12c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg mb-2 text-center">
                                まだポートフォリオは投稿されていません。
                            </p>
                            {isOwnProfile && (
                                <Link
                                    href="/portfolios/create"
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    ポートフォリオを作成する
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
