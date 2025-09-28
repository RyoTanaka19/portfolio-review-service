import React from "react";
import { Link } from "@inertiajs/react";
import RankingHeader from "@/Pages/Reviews/Rankings/Partials/RankingHeader";

export default function RankingList({
    portfolios,
    headerProps,
    tagColor,
    bgColor,
}) {
    const rankColors = ["text-yellow-500", "text-gray-400", "text-orange-500"];

    return (
        <div className={`${bgColor} min-h-screen`}>
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
                                                投稿者:{" "}
                                                <Link
                                                    href={`/profile/${p.user_id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {p.user_name}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

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
                                                className={`px-3 py-1 rounded-full ${tagColor} text-xs font-medium`}
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
        </div>
    );
}
