import React from "react";
import axios from "axios";

export default function ReviewList({
    reviews,
    auth,
    portfolioId,
    onToggleChecked,
    onDeleted,
    onEdit, // 編集ボタン用
    editingReviewId, // 追加: 現在編集中のレビューID
}) {
    // レビュー削除
    const deleteReview = async (reviewId) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await axios.delete(
                `/portfolio/${portfolioId}/reviews/${reviewId}`,
                { headers: { "X-Requested-With": "XMLHttpRequest" } }
            );

            if (response.data.success) {
                onDeleted(reviewId);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || "レビュー削除に失敗しました"
            );
        }
    };

    // レビュー確認チェック
    const toggleReviewChecked = async (review) => {
        try {
            const response = await axios.post(
                `/reviews/${review.id}/check`,
                {},
                { headers: { "X-Requested-With": "XMLHttpRequest" } }
            );
            onToggleChecked(review.id, response.data.checked);
        } catch (error) {
            console.error(error);
            alert("レビュー確認通知に失敗しました");
        }
    };

    return (
        <div className="space-y-4">
            {reviews
                .slice()
                .sort((a, b) => {
                    if (!a.comment && b.comment) return 1;
                    if (a.comment && !b.comment) return -1;
                    if (!a.comment && !b.comment) return 0;
                    return a.checked === b.checked ? 0 : a.checked ? 1 : -1;
                })
                .map((review) => {
                    const containerClass = review.comment
                        ? review.checked
                            ? "p-4 border rounded-lg bg-green-100 flex flex-col gap-2"
                            : "p-4 border rounded-lg bg-yellow-50 flex flex-col gap-2"
                        : "p-4 border rounded-lg bg-gray-50 flex flex-col gap-2";

                    return (
                        <div key={review.id} className={containerClass}>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="text-gray-700 font-semibold mr-2">
                                        評価: {review.rating} / 5
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        投稿者: {review.user?.name || "不明"}
                                    </span>
                                </div>

                                {auth &&
                                    review.user &&
                                    auth.id === review.user.id &&
                                    review.id !== editingReviewId && ( // ← 追加: 編集中は非表示
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    deleteReview(review.id)
                                                }
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                削除
                                            </button>

                                            {onEdit && (
                                                <button
                                                    onClick={() =>
                                                        onEdit(review)
                                                    }
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    編集
                                                </button>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="flex items-center gap-2">
                                {review.comment && (
                                    <input
                                        type="checkbox"
                                        checked={review.checked}
                                        onChange={() =>
                                            toggleReviewChecked(review)
                                        }
                                    />
                                )}
                                <p className="text-gray-600">
                                    {review.comment
                                        ? review.comment
                                        : `${
                                              review.user?.name || "不明"
                                          }さんがレビューしました`}
                                </p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
