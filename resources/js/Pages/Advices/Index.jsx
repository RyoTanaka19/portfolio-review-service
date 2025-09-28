import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import FlashMessage from "@/Components/FlashMessage/FlashMessage";

export default function AdvicesIndex({ advices }) {
    const [advicesList, setAdvicesList] = useState(advices || []);
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashType, setFlashType] = useState("success"); // success or error

    const handleDelete = async (id) => {
        if (!window.confirm("本当に削除しますか？")) return;

        try {
            const response = await fetch(`/advices/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setFlashType("error");
                setFlashMessage(data.error || "削除中にエラーが発生しました");
                return;
            }

            // 削除成功 → state 更新
            setAdvicesList((prev) => prev.filter((advice) => advice.id !== id));

            // フラッシュメッセージを表示
            setFlashType("success");
            setFlashMessage(data.message || "削除しました");
        } catch (error) {
            console.error("削除エラー:", error);
            setFlashType("error");
            setFlashMessage("削除中に予期せぬエラーが発生しました");
        }
    };

    return (
        <AppLayout>
            <div className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-center text-green-500">
                    過去のアドバイス一覧
                </h1>

                {/* FlashMessageコンポーネントを利用 */}
                <FlashMessage
                    message={flashMessage}
                    type={flashType}
                    onClose={() => setFlashMessage(null)}
                />

                {advicesList.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        まだアドバイスはありません。
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advicesList.map((advice) => (
                            <li
                                key={advice.id}
                                className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow transform hover:scale-105"
                            >
                                <button
                                    onClick={() => handleDelete(advice.id)}
                                    className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700 focus:outline-none"
                                >
                                    ×
                                </button>

                                <div className="mb-4">
                                    <p className="text-lg font-semibold text-green-600 mb-2">
                                        サービス名:
                                        <span className="text-green-6z00">
                                            {" "}
                                            {advice.service_name}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-semibold text-gray-800">
                                            概要:
                                        </span>
                                        <span className="text-gray-700">
                                            {advice.service_description}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-semibold text-gray-800">
                                            ユーザー層:
                                        </span>
                                        <span className="text-gray-700">
                                            {advice.target_users}
                                        </span>
                                    </p>
                                    {advice.service_issues && (
                                        <p className="text-sm text-red-600 mb-2">
                                            <span className="font-semibold">
                                                課題:
                                            </span>{" "}
                                            {advice.service_issues}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 text-gray-800 bg-green-50 p-4 rounded-lg">
                                    <p className="font-semibold text-green-700">
                                        アドバイス:
                                    </p>
                                    <p className="whitespace-pre-line text-gray-700">
                                        {advice.ai_advice}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-400 mt-3 text-right">
                                    {new Date(
                                        advice.created_at
                                    ).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
}
