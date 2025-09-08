// resources/js/Pages/Bookmarks/Create.jsx
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function BookmarkButton({ portfolioId, initialBookmarked }) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

    const toggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await Inertia.delete(route("bookmark.destroy", portfolioId), {
                    onSuccess: () => setIsBookmarked(false),
                });
            } else {
                await Inertia.post(
                    route("bookmark.store", portfolioId),
                    {},
                    {
                        onSuccess: () => setIsBookmarked(true),
                    }
                );
            }
        } catch (error) {
            console.error(error);
            alert("ブックマークの更新に失敗しました");
        }
    };

    return (
        <button
            type="button"
            onClick={toggleBookmark}
            className={`mt-2 px-2 py-1 rounded text-sm ${
                isBookmarked
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-800"
            }`}
        >
            {isBookmarked ? "★ お気に入り" : "☆ お気に入り"}
        </button>
    );
}
