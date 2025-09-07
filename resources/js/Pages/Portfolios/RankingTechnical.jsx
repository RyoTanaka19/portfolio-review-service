import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function RankingTechnical({ portfolios }) {
    return (
        <AppLayout>
            <header className="px-8 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 shadow text-center">
                <h1 className="text-3xl font-bold">技術力ランキング TOP10</h1>
                <p className="text-gray-600 mt-2 text-base">
                    技術力の平均評価でランキング
                </p>
                <div className="mt-4 space-x-4">
                    <Link
                        href="/ranking"
                        className="text-blue-500 hover:underline"
                    >
                        総合
                    </Link>
                    <Link
                        href="/ranking/technical"
                        className="text-blue-500 hover:underline"
                    >
                        技術力
                    </Link>
                    <Link
                        href="/ranking/usability"
                        className="text-blue-500 hover:underline"
                    >
                        使いやすさ
                    </Link>
                    <Link
                        href="/ranking/design"
                        className="text-blue-500 hover:underline"
                    >
                        デザイン性
                    </Link>
                    <Link
                        href="/ranking/user_focus"
                        className="text-blue-500 hover:underline"
                    >
                        ユーザー目線
                    </Link>
                </div>
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
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xl font-bold">
                                            {idx + 1}
                                        </span>
                                        <Link
                                            href={`/portfolio/${p.id}`}
                                            className="ml-2 text-blue-600 hover:underline"
                                        >
                                            {p.title}
                                        </Link>
                                        <p className="text-gray-500 text-sm">
                                            投稿者: {p.user_name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {p.avg_rating} / 5
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {p.review_count} 件のレビュー
                                        </p>
                                    </div>
                                </div>
                                {p.image_url && (
                                    <img
                                        src={p.image_url}
                                        alt={p.title}
                                        className="w-full h-48 object-cover mt-4 rounded-xl"
                                    />
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </main>
        </AppLayout>
    );
}
