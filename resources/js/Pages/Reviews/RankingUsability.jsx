import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function RankingUsability({ portfolios }) {
    const rankColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];

    return (
        <AppLayout>
            {/* ヘッダー */}
            <header className="px-8 py-8 bg-gradient-to-r from-green-50 to-green-100 shadow text-center">
                <h1 className="text-3xl font-bold">
                    使いやすさランキング TOP10
                </h1>
                <p className="text-gray-600 mt-2 text-base">
                    使いやすさの平均評価でランキング
                </p>

                {/* 評価項目別リンク */}
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                    <Link
                        href="/ranking"
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200"
                    >
                        総合
                    </Link>
                    <Link
                        href="/ranking/technical"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                    >
                        技術力
                    </Link>
                    <Link
                        href="/ranking/usability"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200"
                    >
                        使いやすさ
                    </Link>
                    <Link
                        href="/ranking/design"
                        className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium hover:bg-pink-200"
                    >
                        デザイン性
                    </Link>
                    <Link
                        href="/ranking/user-focus"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200"
                    >
                        ユーザー目線
                    </Link>
                </div>
            </header>

            {/* メイン */}
            <main className="px-8 py-10 max-w-4xl mx-auto">
                {portfolios.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">
                        ランキング対象の投稿がまだありません。
                    </p>
                ) : (
                    <ol className="space-y-6">
                        {portfolios.map((p, idx) => (
                            <li
                                key={p.id}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                            >
                                <div className="flex items-start justify-between">
                                    {/* 左側: 順位 + タイトル */}
                                    <div className="flex items-start gap-4">
                                        <span
                                            className={`text-3xl font-extrabold w-10 text-right ${
                                                rankColors[idx] ||
                                                "text-gray-700"
                                            }`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <Link
                                                href={`/portfolio/${p.id}`}
                                                className="text-xl font-semibold text-blue-600 hover:underline"
                                            >
                                                {p.title}
                                            </Link>
                                            <div className="text-sm text-gray-500 mt-1">
                                                投稿者: {p.user_name}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 右側: 評価 */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-800">
                                            {p.avg_rating}
                                            <span className="text-gray-500 text-base">
                                                {" "}
                                                / 5
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {p.reviews_count} 件のレビュー
                                        </div>
                                    </div>
                                </div>

                                {/* 画像 */}
                                {p.image_url && (
                                    <img
                                        src={p.image_url}
                                        alt={p.title}
                                        className="w-full h-48 object-cover mt-4 rounded-xl"
                                    />
                                )}

                                {/* タグ */}
                                {p.tags?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {p.tags.map((t, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
                                            >
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 説明文 */}
                                {p.description && (
                                    <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                                        {p.description}
                                    </p>
                                )}

                                {/* 外部リンク */}
                                {p.url && (
                                    <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 text-blue-600 text-sm font-medium hover:underline"
                                    >
                                        サイトを見る →
                                    </a>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </main>
        </AppLayout>
    );
}
