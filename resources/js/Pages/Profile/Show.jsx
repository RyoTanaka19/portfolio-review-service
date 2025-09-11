import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import BookmarkButton from "@/Pages/Bookmarks/BookmarkButton";

export default function Show() {
    const { props } = usePage();
    const { user, authUserId, portfolios = [] } = props;

    const isOwnProfile = authUserId === user.id;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Head title={`${user.name} のプロフィール`} />
            <h1 className="text-3xl font-bold mb-2">
                {user.name} のプロフィール
            </h1>

            {/* メールアドレスは自分だけ表示 */}
            {isOwnProfile && (
                <p className="text-gray-600 mb-6">
                    メールアドレス: {user.email}
                </p>
            )}

            {portfolios.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        {isOwnProfile
                            ? "あなたの投稿したポートフォリオ"
                            : "投稿したポートフォリオ"}
                    </h2>

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
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col overflow-hidden"
                                >
                                    {/* 画像 */}
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
                                        {/* タイトル */}
                                        <Link
                                            href={`/portfolio/${p.id}`}
                                            className="font-bold text-xl text-blue-600 hover:underline mb-2 truncate"
                                        >
                                            {p.title}
                                        </Link>

                                        {/* 作者名 */}
                                        <div className="mb-2">
                                            <span className="text-gray-500 text-sm">
                                                作者:{" "}
                                            </span>
                                            <Link
                                                href={`/profile/${p.user_id}`}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                {p.user_name}
                                            </Link>
                                        </div>

                                        {/* 説明 */}
                                        <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                                            {p.description}
                                        </p>

                                        {/* 平均評価 */}
                                        {averageRating && (
                                            <p className="text-yellow-600 font-semibold mb-3">
                                                ⭐ 平均評価: {averageRating} / 5
                                                ({p.reviews.length}件)
                                            </p>
                                        )}

                                        {/* URL */}
                                        {p.url && (
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 text-sm mb-3 hover:underline"
                                            >
                                                サイトを見る →
                                            </a>
                                        )}

                                        {/* タグ */}
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

                                        {/* ブックマークは自分だけ */}
                                        {isOwnProfile && (
                                            <div className="mt-3">
                                                <BookmarkButton
                                                    portfolioId={p.id}
                                                    initialBookmarked={
                                                        p.is_bookmarked || false
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
