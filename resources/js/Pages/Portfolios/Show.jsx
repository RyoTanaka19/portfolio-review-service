import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import ReviewIndex from "@/Pages/Portfolios/Partials/PortfolioReviews";
import AppLayout from "@/Layouts/AppLayout";

export default function Show({ portfolio, auth, errors, flash }) {
    return (
        <AppLayout auth={auth}>
            <div className="flex flex-col flex-1 bg-gray-100">
                <div className="flex-1 flex justify-center py-10 px-4">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                        {/* タイトル */}
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            <InertiaLink
                                href={`/portfolio/${portfolio.id}/accesses`}
                                className="hover:underline text-blue-600"
                            >
                                {portfolio.title}
                            </InertiaLink>
                        </h1>

                        {/* OGP画像 */}
                        {portfolio.image_url && (
                            <div className="mb-6 flex justify-center">
                                <img
                                    src={portfolio.image_url}
                                    alt={portfolio.title}
                                    className="w-full max-w-md object-cover rounded"
                                />
                            </div>
                        )}

                        {/* 作品説明 */}
                        {portfolio.description && (
                            <div className="mb-2">
                                <h2 className="text-xl font-semibold mb-1 text-gray-700">
                                    作品説明
                                </h2>
                                <p className="text-gray-600">
                                    {portfolio.description}
                                </p>
                            </div>
                        )}

                        {/* 作成者表示（作品説明と同じスタイル） */}
                        {portfolio.user && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-1 text-gray-700">
                                    作成者
                                </h2>
                                <p className="text-gray-600">
                                    <InertiaLink
                                        href={`/profile/${portfolio.user.id}`}
                                        className="hover:underline text-blue-600"
                                    >
                                        {portfolio.user.name}
                                    </InertiaLink>
                                </p>
                            </div>
                        )}

                        {/* 作品URL */}
                        {portfolio.service_url && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    作品URL
                                </h2>
                                <a
                                    href={`/portfolio/${portfolio.id}/visit`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all"
                                >
                                    {portfolio.service_url}
                                </a>
                            </div>
                        )}

                        {/* GitHub URL */}
                        {portfolio.repository_url && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    リポジトリURL
                                </h2>
                                <a
                                    href={portfolio.repository_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all"
                                >
                                    {portfolio.repository_url}
                                </a>
                            </div>
                        )}

                        {/* タグ */}
                        {portfolio.tags?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    タグ
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* レビュー */}
                        {auth?.user ? (
                            <ReviewIndex
                                portfolio={portfolio}
                                auth={auth}
                                errors={errors}
                                flash={flash}
                            />
                        ) : (
                            <div className="text-center text-gray-600 mt-8">
                                <InertiaLink
                                    href={route("login")}
                                    className="text-blue-500 hover:underline"
                                >
                                    レビューを投稿するにはログインしてください
                                </InertiaLink>
                            </div>
                        )}

                        {/* Twitterシェアボタン */}
                        {auth?.user && portfolio.service_url && (
                            <div className="mb-6 text-center">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                        `${portfolio.title}\n\n${
                                            portfolio.description ?? ""
                                        }\n作成者: ${
                                            portfolio.user?.name ?? "不明"
                                        }`
                                    )}&url=${encodeURIComponent(
                                        portfolio.service_url
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Twitterでシェア
                                </a>
                            </div>
                        )}

                        {/* 一覧に戻る */}
                        <div className="text-center mt-8">
                            <InertiaLink
                                href="/portfolios"
                                className="inline-block px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
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
