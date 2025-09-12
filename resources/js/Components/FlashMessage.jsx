import React, { useEffect, useState } from "react";

export default function FlashMessage({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            // 最初は右に隠れている状態から始める
            setVisible(false);

            // 次の描画フレームで表示アニメーション開始
            const showTimer = setTimeout(() => {
                setVisible(true);
            }, 50);

            // 一定時間後に非表示にする
            const hideTimer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // アニメーション終了後に削除
            }, 3000);

            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [message]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transform transition-transform duration-300 ${
                visible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div
                className={`w-80 px-6 py-3 rounded-lg shadow-lg text-base font-semibold text-white ${
                    type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
            >
                {message}
            </div>
        </div>
    );
}
