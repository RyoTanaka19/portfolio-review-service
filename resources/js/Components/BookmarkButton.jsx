import React, { useState } from "react";
import axios from "axios";
import FlashMessage from "@/Components/FlashMessage";

export default function BookmarkButton({
    portfolioId,
    initialBookmarked,
    onToggle, // ← 親に通知するコールバックを追加
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [loading, setLoading] = useState(false);
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashType, setFlashType] = useState("success");

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
                    setFlashMessage(res.data.message);
                    setFlashType("success");
                    onToggle && onToggle(false, res.data.message); // ← 追加
                }
            } else {
                // ブックマーク登録
                res = await axios.post(`/portfolios/${portfolioId}/bookmark`);
                if (res.data.success) {
                    setIsBookmarked(true);
                    setFlashMessage(res.data.message);
                    setFlashType("success");
                    onToggle && onToggle(true, res.data.message); // ← 追加
                }
            }
        } catch (err) {
            console.error(err);
            setFlashMessage("通信エラーが発生しました");
            setFlashType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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

            <FlashMessage
                message={flashMessage}
                type={flashType}
                onClose={() => setFlashMessage(null)}
            />
        </>
    );
}
