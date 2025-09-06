import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Index({ portfolios = [] }) {
    return (
        <AppLayout>
            <header className="px-8 py-6 bg-white shadow flex justify-center">
                <h1 className="text-3xl font-bold">お気に入り一覧</h1>
            </header>

            <main className="px-4 py-8 max-w-6xl mx-auto">
                {portfolios.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 text-lg font-medium">
                            お気に入りはまだありません
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolios?.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
                            >
                                <h2 className="font-bold text-lg truncate mb-2">
                                    <InertiaLink
                                        href={`/portfolio/${p.id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {p.title}
                                    </InertiaLink>
                                </h2>

                                {p.image_url && (
                                    <img
                                        src={p.image_url}
                                        alt={p.title}
                                        className="w-full h-40 object-cover mb-3 rounded"
                                    />
                                )}

                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                                    {p.description}
                                </p>

                                {p.average_rating && (
                                    <p className="text-yellow-600 font-semibold mb-2">
                                        平均評価: {p.average_rating} / 5
                                    </p>
                                )}

                                {p.tags?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
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
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </AppLayout>
    );
}
