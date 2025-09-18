// Reviews/Components/Index.jsx
import React, { useState } from "react";
import axios from "axios";
import ReviewForm from "@/Components/Reviews/ReviewForm";
import ReviewList from "@/Components/Reviews/ReviewList";
import ReviewChart from "@/Components/ReviewChart";
import FlashMessage from "@/Components/FlashMessage";

export default function ReviewIndex({ portfolio, auth, errors, flash }) {
    const [reviews, setReviews] = useState(
        (portfolio.reviews || []).map((r) => ({
            ...r,
            checked: r.checked ?? false,
        }))
    );
    const [flashMessage, setFlashMessage] = useState(flash?.success || "");
    const [editingReview, setEditingReview] = useState(null);

    // 投稿 or 更新後の処理
    const handleSuccess = (review, isEdit) => {
        if (isEdit) {
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === review.id ? { ...review, checked: r.checked } : r
                )
            );
            setFlashMessage("レビューを更新しました");
            setEditingReview(null); // 編集終了
        } else {
            setReviews((prev) => [{ ...review, checked: false }, ...prev]);
            setFlashMessage("レビューを投稿しました");
        }
    };

    // 編集ボタン押下
    const handleEdit = (review) => {
        setEditingReview(review);
    };

    // キャンセルボタン押下
    const handleCancelEdit = () => {
        setEditingReview(null);
    };

    // チェック状態切替
    const handleToggleChecked = (reviewId, isChecked) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId ? { ...r, checked: isChecked } : r
            )
        );
    };

    // レビュー削除
    const handleDelete = async (reviewId) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await axios.delete(
                `/portfolio/${portfolio.id}/reviews/${reviewId}`,
                { headers: { "X-Requested-With": "XMLHttpRequest" } }
            );

            if (response.data.success) {
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
                setFlashMessage("レビューを削除しました");
            } else {
                alert(response.data.message || "削除に失敗しました");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "レビュー削除に失敗しました");
        }
    };

    return (
        <div className="mt-6 mb-6">
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                レビュー
            </h2>

            <div className="mb-6">
                <ReviewChart reviews={reviews} />
            </div>

            <ReviewList
                reviews={reviews}
                auth={auth?.user}
                portfolioId={portfolio.id}
                onToggleChecked={handleToggleChecked}
                onDeleted={handleDelete}
                onEdit={handleEdit} // 編集ボタン連携
                editingReviewId={editingReview?.id}
            />

            {auth?.user && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingReview
                            ? "レビューを編集する"
                            : "レビューを投稿する"}
                    </h2>

                    <ReviewForm
                        key={editingReview?.id ?? "new"} // 編集対象切り替えでリセット
                        portfolio={portfolio}
                        errors={errors}
                        onSuccess={(review) =>
                            handleSuccess(review, !!editingReview)
                        }
                        initialData={editingReview} // null の場合は新規投稿
                        onCancel={handleCancelEdit} // キャンセルボタン連携
                    />
                </div>
            )}
        </div>
    );
}
