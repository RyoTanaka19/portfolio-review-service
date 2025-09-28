import React from "react";
import { Link } from "@inertiajs/react";
import RankingHeader from "@/Pages/Reviews/Rankings/Partials/RankingHeader";

export default function RankingList({
    portfolios,
    headerProps,
    colors, // ← 複数の色をまとめて渡す
}) {
    return (
        <div className="bg-gray-100 min-h-screen">
            <RankingHeader {...headerProps} />

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
                                    <div className="flex items-start gap-4">
                                        {/* ランキング順位 */}
                                        <span
                                            className={`text-3xl font-extrabold w-10 text-right ${colors.rank}`}
                                        >
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <Link
                                                href={`/portfolio/${p.id}`}
                                                className={`text-xl font-semibold ${colors.title}`}
                                            >
                                                {p.title}
                                            </Link>
                                            <div
                                                className={`text-sm mt-1 ${colors.author}`}
                                            >
                                                投稿者:{" "}
                                                <Link
                                                    href={`/profile/${p.user_id}`}
                                                    className={colors.author}
                                                >
                                                    {p.user_name}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div
                                            className={`text-2xl font-bold ${colors.reviews}`}
                                        >
                                            {p.avg_rating}
                                            <span className="text-gray-500 text-base">
                                                {" "}
                                                / 5
                                            </span>
                                        </div>
                                        <div
                                            className={`text-sm ${colors.reviews}`}
                                        >
                                            {p.reviews_count} 件のレビュー
                                        </div>
                                    </div>
                                </div>

                                {/* OGP画像 */}
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center mt-4 rounded-xl overflow-hidden">
                                    {p.image_url ? (
                                        <Link href={`/portfolio/${p.id}`}>
                                            <img
                                                src={p.image_url}
                                                alt={p.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                    ) : (
                                        <span className="text-gray-500 text-sm text-center">
                                            OGP画像なし
                                        </span>
                                    )}
                                </div>

                                {p.tags?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {p.tags.map((t, i) => (
                                            <span
                                                key={i}
                                                className={`px-3 py-1 rounded-full ${colors.tag} text-xs font-medium`}
                                            >
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {p.service_url && (
                                    <a
                                        href={`/portfolio/${p.id}/visit`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block mt-4 text-sm font-medium ${colors.link}`}
                                    >
                                        サイトを見る →
                                    </a>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </main>
        </div>
    );
}
