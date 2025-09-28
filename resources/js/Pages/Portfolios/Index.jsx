import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import AppLayout from "@/Layouts/AppLayout";
import axios from "axios";
import BookmarkButton from "@/Components/Bookmark/BookmarkButton";
import PortfolioSearch from "@/Pages/Portfolios/Partials/PortfolioSearch";
import FlashMessage from "@/Components/FlashMessage/FlashMessage";
import Pagination from "@/Components/Pagination/Pagination";

export default function Index({ portfolios, auth, allTags = [], flash = {} }) {
    const [portfolioList, setPortfolioList] = useState(portfolios.data || []);
    const [pagination, setPagination] = useState({
        current_page: portfolios.current_page || 1,
        last_page: portfolios.last_page || 1,
        next_page_url: portfolios.next_page_url || null,
        prev_page_url: portfolios.prev_page_url || null,
        filters: {},
    });

    const [flashMessage, setFlashMessage] = useState({
        message: flash.success || flash.error || null,
        type: flash.success ? "success" : flash.error ? "error" : null,
    });

    const handleDelete = async (id) => {
        if (!confirm("本当に削除しますか？")) return;
        try {
            const res = await axios.delete(`/portfolio/${id}`);
            if (res.data.success) {
                setPortfolioList((prev) => prev.filter((p) => p.id !== id));
                setFlashMessage({ message: res.data.message, type: "success" });
            } else {
                setFlashMessage({
                    message: res.data.error || "削除に失敗しました",
                    type: "error",
                });
            }
        } catch (err) {
            console.error(err);
            setFlashMessage({ message: "削除に失敗しました", type: "error" });
        }
    };

    const fetchPage = (page) => {
        if (!page) return;
        Inertia.get(`/portfolios?page=${page}`, pagination.filters || {}, {
            preserveState: true,
            onSuccess: (pageData) => {
                const props = pageData.props.portfolios;
                setPortfolioList(props.data || []);
                setPagination({
                    current_page: props.current_page,
                    last_page: props.last_page,
                    next_page_url: props.next_page_url,
                    prev_page_url: props.prev_page_url,
                    filters: pagination.filters,
                });
            },
        });
    };

    return (
        <AppLayout>
            {/* ページ全体の背景ラッパー */}
            <div className="bg-gray-100 min-h-screen">
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    onClose={() =>
                        setFlashMessage({ message: null, type: null })
                    }
                />

                {/* 検索フォーム */}
                <div className="px-4 py-6 bg-white shadow mb-6">
                    <h1 className="text-2xl font-bold mb-4 text-center text-purple-400">
                        ポートフォリオ一覧
                    </h1>
                    <PortfolioSearch
                        allTags={allTags}
                        filters={pagination.filters}
                        portfolioList={portfolioList}
                        setPortfolioList={setPortfolioList}
                        setPagination={setPagination}
                    />
                </div>

                {/* ポートフォリオ一覧 */}
                <main className="px-4 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioList?.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white flex flex-col rounded shadow hover:shadow-lg transition duration-200 overflow-hidden"
                        >
                            {/* OGP画像 */}
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                {p.image_url ? (
                                    <Link
                                        href={`/portfolio/${p.id}`}
                                        className="w-full h-full block"
                                    >
                                        <img
                                            src={p.image_url}
                                            alt={p.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center px-2">
                                        <span className="text-gray-500 text-base text-center">
                                            OGP画像なし
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 内容部分 */}
                            <div className="p-4 flex flex-col flex-1 gap-2">
                                <Link
                                    href={`/portfolio/${p.id}`}
                                    className="font-bold text-lg text-blue-500 hover:underline line-clamp-2"
                                >
                                    {p.title}
                                </Link>

                                <Link
                                    href={`/profile/${p.user_id}`}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    {p.user_name}
                                </Link>

                                {/* タグ */}
                                {p.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {p.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs cursor-default"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 総合評価 */}
                                <div className="mt-2">
                                    {p.reviews?.length > 0 ? (
                                        <span className="inline-block px-3 py-1 bg-orange-400 text-white rounded text-sm font-medium">
                                            総合評価:{" "}
                                            {(
                                                p.reviews
                                                    .map(
                                                        (r) =>
                                                            [
                                                                r.technical,
                                                                r.usability,
                                                                r.design,
                                                                r.user_focus,
                                                            ]
                                                                .filter(
                                                                    (v) =>
                                                                        v !==
                                                                        null
                                                                )
                                                                .reduce(
                                                                    (a, b) =>
                                                                        a + b,
                                                                    0
                                                                ) /
                                                            [
                                                                r.technical,
                                                                r.usability,
                                                                r.design,
                                                                r.user_focus,
                                                            ].filter(
                                                                (v) =>
                                                                    v !== null
                                                            ).length
                                                    )
                                                    .reduce(
                                                        (sum, v) => sum + v,
                                                        0
                                                    ) / p.reviews.length
                                            ).toFixed(1)}{" "}
                                            / 5
                                        </span>
                                    ) : (
                                        <p className="text-gray-500">
                                            まだ、レビューがありません
                                        </p>
                                    )}
                                </div>

                                <div className="mt-2 flex justify-between items-center">
                                    {p.service_url && (
                                        <a
                                            href={`/portfolio/${p.id}/visit`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-sm hover:underline"
                                        >
                                            サイトを見る →
                                        </a>
                                    )}
                                    {auth?.user && (
                                        <BookmarkButton
                                            portfolioId={p.id}
                                            initialBookmarked={
                                                p.is_bookmarked || false
                                            }
                                            onToggle={(_, msg) =>
                                                setFlashMessage({
                                                    message: msg,
                                                    type: "success",
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {auth?.user && auth.user.id === p.user_id && (
                                <div className="px-4 pb-4 flex justify-end gap-2">
                                    <Link
                                        href={`/portfolios/${p.id}/edit`}
                                        className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm"
                                    >
                                        編集
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(p.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </main>

                {portfolioList.length > 0 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={fetchPage}
                    />
                )}
            </div>
        </AppLayout>
    );
}
