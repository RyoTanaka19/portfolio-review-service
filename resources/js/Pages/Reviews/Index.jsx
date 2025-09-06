import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

export default function ReviewIndex({ portfolio, auth, errors, flash }) {
    const [comment, setComment] = useState("");
    const [technical, setTechnical] = useState(5); // 技術力
    const [usability, setUsability] = useState(5); // 使いやすさ
    const [design, setDesign] = useState(5); // デザイン性
    const [userFocus, setUserFocus] = useState(5); // ユーザー目線
    const [showFlash, setShowFlash] = useState(false);

    const [reviews, setReviews] = useState(
        (portfolio.reviews || []).map((r) => ({ ...r, checked: false }))
    );
    const [notifications, setNotifications] = useState([]);

    // 4項目から総合評価を自動計算（四捨五入）
    const rating = Math.round((technical + usability + design + userFocus) / 4);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/notifications");
                setNotifications(response.data.notifications || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotifications();
    }, []);

    const markNotificationAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/read`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleReviewChecked = async (review) => {
        const isChecked = !review.checked;
        setReviews((prev) =>
            prev.map((r) =>
                r.id === review.id ? { ...r, checked: isChecked } : r
            )
        );

        if (isChecked) {
            try {
                await axios.post(`/reviews/${review.id}/check`);
            } catch (error) {
                console.error("通知送信に失敗:", error);
            }
        }
    };

    const submitReview = (e) => {
        e.preventDefault();
        Inertia.post(
            `/portfolio/${portfolio.id}/reviews`,
            {
                rating, // 自動計算された値
                comment,
                technical,
                usability,
                design,
                user_focus: userFocus,
            },
            {
                onSuccess: (page) => {
                    setReviews(
                        (page.props.portfolio?.reviews || []).map((r) => ({
                            ...r,
                            checked: false,
                        }))
                    );
                    // フォーム初期化
                    setComment("");
                    setTechnical(5);
                    setUsability(5);
                    setDesign(5);
                    setUserFocus(5);
                },
                preserveScroll: true,
            }
        );
    };

    const deleteReview = (reviewId) => {
        if (!confirm("本当に削除しますか？")) return;
        Inertia.delete(`/portfolio/${portfolio.id}/reviews/${reviewId}`, {
            onSuccess: (page) => {
                setReviews(
                    (page.props.portfolio?.reviews || []).map((r) => ({
                        ...r,
                        checked: false,
                    }))
                );
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="mt-6 mb-6">
            {showFlash && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
                    {flash.success}
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                レビュー
            </h2>

            {/* レビュー一覧 */}
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 font-semibold">
                                    評価: {review.rating} / 5
                                </span>
                                <span className="text-gray-400 text-sm">
                                    投稿者: {review.user?.name || "不明"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={review.checked}
                                    onChange={() => toggleReviewChecked(review)}
                                />
                                <p className="text-gray-600">
                                    {review.comment}
                                </p>
                            </div>
                            {auth?.id === review.user?.id && (
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
                        {/* 総合評価（自動計算） */}
                        <div>
                            <label className="block text-gray-700 mb-1">
                                総合評価 (自動計算)
                            </label>
                            <input
                                type="text"
                                value={rating}
                                readOnly
                                className="w-full border rounded px-3 py-2 bg-gray-100"
                            />
                        </div>

                        {/* コメント */}
                        <div>
                            <label className="block text-gray-700 mb-1">
                                コメント
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {errors?.comment && (
                                <p className="text-red-500 mt-1">
                                    {errors.comment}
                                </p>
                            )}
                        </div>

                        {/* 4項目評価 */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* 技術力 */}
                            <div>
                                <label className="block text-gray-700 mb-1">
                                    技術力
                                </label>
                                <select
                                    value={technical}
                                    onChange={(e) =>
                                        setTechnical(Number(e.target.value))
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 使いやすさ */}
                            <div>
                                <label className="block text-gray-700 mb-1">
                                    使いやすさ
                                </label>
                                <select
                                    value={usability}
                                    onChange={(e) =>
                                        setUsability(Number(e.target.value))
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* デザイン性 */}
                            <div>
                                <label className="block text-gray-700 mb-1">
                                    デザイン性
                                </label>
                                <select
                                    value={design}
                                    onChange={(e) =>
                                        setDesign(Number(e.target.value))
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ユーザー目線 */}
                            <div>
                                <label className="block text-gray-700 mb-1">
                                    ユーザー目線
                                </label>
                                <select
                                    value={userFocus}
                                    onChange={(e) =>
                                        setUserFocus(Number(e.target.value))
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
