// resources/js/Pages/Reviews/Index.jsx
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function ReviewIndex({ portfolio, auth, errors, flash }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const submitReview = (e) => {
        e.preventDefault();
        Inertia.post(`/portfolio/${portfolio.id}/reviews`, { rating, comment });
    };

    const deleteReview = (reviewId) => {
        if (confirm("本当に削除しますか？")) {
            Inertia.delete(`/portfolio/${portfolio.id}/reviews/${reviewId}`);
        }
    };

    return (
        <div className="mt-6 mb-6">
            {/* ポップアップフラッシュ */}
            {showFlash && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
                    {flash.success}
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                レビュー
            </h2>

            {/* レビュー一覧 */}
            {portfolio.reviews && portfolio.reviews.length > 0 ? (
                <div className="space-y-4">
                    {portfolio.reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 border rounded-lg bg-gray-50"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 font-semibold">
                                    評価: {review.rating} / 5
                                </span>
                                <span className="text-gray-400 text-sm">
                                    投稿者: {review.user.name}
                                </span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>

                            {auth && auth.id === review.user.id && (
                                <button
                                    onClick={() => deleteReview(review.id)}
                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    削除
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">まだレビューはありません</p>
            )}

            {/* レビュー投稿フォーム */}
            {auth && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        レビューを投稿する
                    </h2>
                    <form onSubmit={submitReview} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-1">
                                評価 (1~5)
                            </label>
                            <select
                                value={rating}
                                onChange={(e) =>
                                    setRating(Number(e.target.value))
                                }
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            {errors?.rating && (
                                <p className="text-red-500 mt-1">
                                    {errors.rating}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">
                                コメント
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>
                            {errors?.comment && (
                                <p className="text-red-500 mt-1">
                                    {errors.comment}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            レビュー
                        </button>
                    </form>
                </div>
            )}

            {/* フェードインアウト用アニメーション */}
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(-10px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s ease forwards;
                }
            `}</style>
        </div>
    );
}
