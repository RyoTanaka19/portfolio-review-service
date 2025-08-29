import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import ReviewIndex from "../Reviews/Index";
import AppLayout from "@/Layouts/AppLayout";

export default function Show({ portfolio, auth, errors, flash }) {
    return (
        <AppLayout auth={auth}>
            <div className="flex flex-col flex-1 bg-gray-100">
                <div className="flex-1 flex justify-center py-10 px-4">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                        {/* タイトル */}
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            {portfolio.title}
                        </h1>

                        {/* 画像表示 */}
                        {portfolio.image_url && (
                            <div className="mb-6 flex justify-center">
                                <img
                                    src={portfolio.image_url} // 修正
                                    alt={portfolio.title}
                                    className="w-full max-w-md object-cover rounded"
                                />
                            </div>
                        )}

                        {/* 作品説明 */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                作品説明
                            </h2>
                            <p className="text-gray-600">
                                {portfolio.description}
                            </p>
                        </div>

                        {/* URL */}
                        {portfolio.url && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    作品URL
                                </h2>
                                <a
                                    href={portfolio.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all"
                                >
                                    {portfolio.url}
                                </a>
                            </div>
                        )}

                        {/* タグ表示 */}
                        {portfolio.tags && portfolio.tags.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    タグ
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.tags.map((tag, idx) => (
                                        <InertiaLink
                                            key={idx}
                                            href={route("dashboard", { tag })}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:bg-blue-200"
                                        >
                                            {tag}
                                        </InertiaLink>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews コンポーネント */}
                        <ReviewIndex
                            portfolio={portfolio}
                            auth={auth}
                            errors={errors}
                            flash={flash}
                        />

                        {/* 一覧に戻るボタン */}
                        <div className="text-center mt-8">
                            <InertiaLink
                                href="/portfolio"
                                className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                一覧に戻る
                            </InertiaLink>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
