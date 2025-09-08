import React, { useState } from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Advice() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        target_users: "",
        issues: "",
    });
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setAdvice("");

        try {
            const res = await fetch("/ai/advice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("AIからの応答に失敗しました");

            const data = await res.json();
            setAdvice(data.advice);
        } catch (err) {
            setError(err.message || "エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="flex-1 flex justify-center bg-gray-50 p-4">
                <div className="w-full max-w-2xl mt-10 bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        AIアドバイスをもらう
                    </h1>

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
                                required
                            />
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
                                required
                            />
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
                                required
                            />
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
                                required
                            />
                        </div>

                        {/* 送信ボタン */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? "AI生成中..." : "アドバイスをもらう"}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {advice && (
                        <div className="mt-8 p-6 bg-gray-100 border-l-4 border-blue-500 rounded shadow-sm">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">
                                AIからのアドバイス
                            </h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {advice}
                            </p>
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
