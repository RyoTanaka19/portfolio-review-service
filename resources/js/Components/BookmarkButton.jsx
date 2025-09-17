import React, { useState } from "react";
import axios from "axios";

export default function BookmarkButton({
    portfolioId,
    initialBookmarked,
    onToggle, // 親に通知するコールバック
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
                if (res.data.success) {
                    setIsBookmarked(false);
                    onToggle && onToggle(false, res.data.message);
                }
            } else {
                // ブックマーク登録
                res = await axios.post(`/portfolios/${portfolioId}/bookmark`);
                if (res.data.success) {
                    setIsBookmarked(true);
                    onToggle && onToggle(true, res.data.message);
                }
            }
        } catch (err) {
            console.error(err);
            onToggle &&
                onToggle(isBookmarked, "通信エラーが発生しました", "error");
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
