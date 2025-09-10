import React, { useState } from "react";
import axios from "axios";

export default function BookmarkButton({
    portfolioId,
    initialBookmarked,
    setFlashMessage,
    setShowFlash,
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [loading, setLoading] = useState(false);

    const toggleBookmark = async () => {
        if (loading) return;

        setLoading(true);

        try {
            let res;
            if (isBookmarked) {
                // ブックマーク解除
                res = await axios.delete(`/portfolios/${portfolioId}/bookmark`);
                if (res.data.success) setIsBookmarked(false);
            } else {
                // ブックマーク作成
                res = await axios.post(`/portfolios/${portfolioId}/bookmark`);
                if (res.data.success) setIsBookmarked(true);
            }

            // フラッシュメッセージを表示
            setFlashMessage({
                success: res.data.success ? res.data.message : null,
                error: res.data.success ? null : res.data.message,
            });
            setShowFlash(true);
        } catch (err) {
            console.error(err);
            setFlashMessage({
                success: null,
                error: "通信エラーが発生しました",
            });
            setShowFlash(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={toggleBookmark}
            disabled={loading}
            className={`mt-2 px-2 py-1 rounded text-sm ${
                isBookmarked
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-800"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {isBookmarked ? "★ お気に入り" : "☆ お気に入り"}
        </button>
    );
}
