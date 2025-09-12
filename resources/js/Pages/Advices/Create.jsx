import React, { useState } from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";
import FlashMessage from "@/Components/FlashMessage";

export default function Advice() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        target_users: "",
        issues: "",
    });
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [flashMessage, setFlashMessage] = useState("");
    const [flashType, setFlashType] = useState("success"); // success or error

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAdvice("");
        setErrors({});
        setFlashMessage("");

        try {
            const res = await fetch("/advices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 422) {
                    setErrors(data.errors || {});
                } else {
                    setFlashType("error");
                    setFlashMessage(data.error || "AIからの応答に失敗しました");
                }
                return;
            }

            setAdvice(data.advice || "");
            if (data.flashMessage) {
                setFlashType("success");
                setFlashMessage(data.flashMessage);
            }
        } catch (err) {
            setFlashType("error");
            setFlashMessage(err.message || "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    const renderError = (field) => {
        if (errors && errors[field]) {
            return (
                <p className="text-red-500 text-sm mt-1">{errors[field][0]}</p>
            );
        }
        return null;
    };

    return (
        <AppLayout>
            <div className="flex-1 flex justify-center bg-gray-50 p-4">
                <div className="w-full max-w-2xl mt-10 bg-white p-8 rounded-lg shadow-md">
                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={flashMessage}
                        type={flashType}
                        onClose={() => setFlashMessage("")}
                    />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* サービス名 */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700">
                                サービス名{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="例: アドバイスをしてもらいたいサービス名"
                            />
                            {renderError("name")}
                        </div>

                        {/* サービス概要 */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700">
                                サービス概要{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows={4}
                                placeholder="例: このサービスの特徴や目的"
                            />
                            {renderError("description")}
                        </div>

                        {/* ターゲットユーザー */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700">
                                ターゲットユーザー{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="target_users"
                                value={form.target_users}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="例: 学生、社会人など"
                            />
                            {renderError("target_users")}
                        </div>

                        {/* 悩み・相談したいこと */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-semibold text-gray-700">
                                悩み・相談したいこと{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="issues"
                                value={form.issues}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows={4}
                                placeholder="例: サービス改善のアイデアが欲しい"
                            />
                            {renderError("issues")}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading && (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            {loading ? "AI生成中..." : "アドバイスをもらう"}
                        </button>
                    </form>

                    {/* AIからのアドバイス */}
                    {advice && (
                        <div className="mt-8 p-6 bg-gray-100 border-l-4 border-blue-500 rounded shadow-sm whitespace-pre-line">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">
                                AIからのアドバイス
                            </h2>
                            <p className="text-gray-700">{advice}</p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <InertiaLink
                            href="/advices"
                            className="text-blue-500 hover:underline font-semibold"
                        >
                            過去のアドバイス一覧を見る
                        </InertiaLink>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
