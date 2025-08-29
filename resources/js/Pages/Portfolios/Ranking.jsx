// resources/js/Pages/Portfolios/Ranking.jsx
import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Ranking({ portfolios }) {
    const rankColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];

    return (
        <AppLayout>
            {/* ヘッダー中央寄せ */}
            <header className="px-8 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 shadow text-center">
                <h1 className="text-3xl font-bold">
                    レビュー総合ランキング TOP10
                </h1>
                <p className="text-gray-600 mt-2 text-base">
                    平均評価（同点はレビュー件数が多い順）
                </p>
            </header>

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

                                    {/* 右側: 評価情報 */}
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

                                {/* タグ */}
                                {p.tags?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {p.tags.map((t, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
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
