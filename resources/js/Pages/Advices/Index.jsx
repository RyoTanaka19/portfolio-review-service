import React, { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "@/Layouts/AppLayout";

export default function AdvicesIndex() {
    const [advices, setAdvices] = useState([]);

    useEffect(() => {
        axios
            .get("/api/advices")
            .then((response) => setAdvices(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("本当に削除しますか？")) return;

        axios
            .delete(`/api/advices/${id}`)
            .then(() => {
                setAdvices((prev) => prev.filter((advice) => advice.id !== id));
            })
            .catch((error) => {
                console.error(error);
                alert("削除中にエラーが発生しました");
            });
    };

    return (
        <AppLayout>
            <div className="flex-1 p-6 bg-gray-50">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
                    過去のアドバイス一覧
                </h1>

                {advices.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        まだアドバイスはありません。
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advices.map((advice) => (
                            <li
                                key={advice.id}
                                className="relative bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                            >
                                {/* 削除ボタン */}
                                <button
                                    onClick={() => handleDelete(advice.id)}
                                    className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
                                >
                                    ×
                                </button>

                                <p className="text-lg font-semibold text-indigo-600 mb-1">
                                    サービス名: {advice.service_name}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold text-gray-800">
                                        概要:
                                    </span>{" "}
                                    {advice.service_description}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold text-gray-800">
                                        ユーザー層:
                                    </span>{" "}
                                    {advice.target_users}
                                </p>
                                {advice.service_issues && (
                                    <p className="text-red-600 mb-1">
                                        <span className="font-semibold">
                                            課題:
                                        </span>{" "}
                                        {advice.service_issues}
                                    </p>
                                )}
                                <p className="mt-2 text-gray-800 whitespace-pre-line bg-indigo-50 p-3 rounded-lg">
                                    <span className="font-semibold text-indigo-700">
                                        アドバイス:
                                    </span>{" "}
                                    {advice.ai_advice}
                                </p>
                                <p className="text-sm text-gray-400 mt-3 text-right">
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
