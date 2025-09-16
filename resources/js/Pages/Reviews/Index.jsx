// Reviews/Components/Index.jsx
import React, { useState } from "react";
import axios from "axios";
import ReviewForm from "./Components/ReviewForm";
import ReviewList from "./Components/ReviewList";
import ReviewChart from "@/Components/ReviewChart";
import FlashMessage from "@/Components/FlashMessage";

export default function ReviewIndex({ portfolio, auth, errors, flash }) {
    const [reviews, setReviews] = useState(
        (portfolio.reviews || []).map((r) => ({
            ...r,
            checked: r.checked ?? false, // ← DB の値を優先
        }))
    );
    const [flashMessage, setFlashMessage] = useState(flash?.success || "");

    // 新しいレビューを追加
    const handleSuccess = (newReview) => {
        setReviews((prev) => [{ ...newReview, checked: false }, ...prev]);
        setFlashMessage("レビューを投稿しました");
    };

    // チェック状態切替
    const handleToggleChecked = (reviewId, isChecked) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId ? { ...r, checked: isChecked } : r
            )
        );
    };

    // レビュー削除（axios に統一 + フラッシュメッセージ表示）
    const handleDelete = async (reviewId) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const response = await axios.delete(
                `/portfolio/${portfolio.id}/reviews/${reviewId}`,
                {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                }
            );

            if (response.data.success) {
                // 削除成功 → state更新
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
                // フラッシュメッセージ表示
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
            {/* フラッシュメッセージ */}
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

            {/* ReviewChart */}
            <div className="mb-6">
                <ReviewChart reviews={reviews} />
            </div>

            {/* ReviewList */}
            <ReviewList
                reviews={reviews}
                auth={auth?.user}
                portfolioId={portfolio.id}
                onToggleChecked={handleToggleChecked}
                onDeleted={handleDelete} // 削除は親で処理
            />

            {/* ReviewForm */}
            {auth?.user && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        レビューを投稿する
                    </h2>
                    <ReviewForm
                        portfolio={portfolio}
                        errors={errors}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}
        </div>
    );
}
