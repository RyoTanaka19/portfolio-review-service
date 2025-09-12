import React, { useEffect, useState } from "react";

export default function FlashMessage({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) return;

        // 表示開始（スライドイン）
        setVisible(true);

        // 3秒後にスライドアウト
        const timer = setTimeout(() => {
            setVisible(false);
            // アニメーション終了後に onClose
            setTimeout(onClose, 300); // 300ms は下の transition と同じ
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-gray-500";

    return (
        <div
            className={`
                fixed top-4 right-0 z-50 px-4 py-2 rounded text-white ${bgColor} shadow
                transform transition-transform duration-300
                ${visible ? "translate-x-0 mr-4" : "translate-x-full"}
            `}
        >
            {message}
            <button
                className="ml-2 text-white font-bold"
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
            >
                ×
            </button>
        </div>
    );
}
