import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ReviewForm({
    portfolio,
    onSuccess,
    initialData = null, // 編集対象のレビュー
    onCancel, // 追加: キャンセルボタン
}) {
    // 初期値設定
    const [comment, setComment] = useState(initialData?.comment || "");
    const [technical, setTechnical] = useState(initialData?.technical ?? null);
    const [usability, setUsability] = useState(initialData?.usability ?? null);
    const [design, setDesign] = useState(initialData?.design ?? null);
    const [userFocus, setUserFocus] = useState(initialData?.user_focus ?? null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // 初期データが切り替わった場合にフォームをリセット
    useEffect(() => {
        setComment(initialData?.comment || "");
        setTechnical(initialData?.technical ?? null);
        setUsability(initialData?.usability ?? null);
        setDesign(initialData?.design ?? null);
        setUserFocus(initialData?.user_focus ?? null);
        setErrors({});
    }, [initialData]);

    // 総合評価を自動計算
    const rating =
        [technical, usability, design, userFocus]
            .filter((v) => v !== null)
            .reduce((sum, v) => sum + v, 0) /
        ([technical, usability, design, userFocus].filter((v) => v !== null)
            .length || 1);

    const submitReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (
            [technical, usability, design, userFocus].every((v) => v === null)
        ) {
            setErrors({ general: "いずれかの評価を入力してください" });
            setLoading(false);
            return;
        }

        try {
            let response;

            if (initialData?.id) {
                // 編集時
                response = await axios.put(
                    `/portfolio/${portfolio.id}/reviews/${initialData.id}`,
                    {
                        comment,
                        technical,
                        usability,
                        design,
                        user_focus: userFocus,
                    },
                    { headers: { "X-Requested-With": "XMLHttpRequest" } }
                );
            } else {
                // 新規投稿
                response = await axios.post(
                    `/portfolio/${portfolio.id}/reviews`,
                    {
                        comment,
                        technical,
                        usability,
                        design,
                        user_focus: userFocus,
                    },
                    { headers: { "X-Requested-With": "XMLHttpRequest" } }
                );
            }

            if (response.data.success) {
                const updatedReview = response.data.review;

                if (onSuccess) {
                    onSuccess(updatedReview, !!initialData?.id);
                }

                // 新規投稿時のみフォームリセット
                if (!initialData?.id) {
                    setComment("");
                    setTechnical(null);
                    setUsability(null);
                    setDesign(null);
                    setUserFocus(null);
                }
            }
        } catch (error) {
            if (error.response?.data) {
                setErrors(
                    error.response.data.errors || {
                        general: error.response.data.message,
                    }
                );
            } else {
                setErrors({ general: "サーバーに接続できません" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitReview} className="space-y-4">
            <div>
                <label>総合評価 (自動計算)</label>
                <input
                    type="text"
                    value={rating ? rating.toFixed(1) : ""}
                    readOnly
                    className="w-full border px-3 py-2 bg-gray-100 rounded"
                />
            </div>

            <div>
                <label>コメント</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.comment && (
                    <p className="text-red-500 mt-1">{errors.comment}</p>
                )}
                {errors.general && (
                    <p className="text-red-500 mt-1">{errors.general}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {["技術力", "使いやすさ", "デザイン性", "ユーザー目線"].map(
                    (label, index) => {
                        const stateSetters = [
                            setTechnical,
                            setUsability,
                            setDesign,
                            setUserFocus,
                        ];
                        const stateValues = [
                            technical,
                            usability,
                            design,
                            userFocus,
                        ];
                        return (
                            <div key={label}>
                                <label>{label}</label>
                                <select
                                    value={stateValues[index] ?? ""}
                                    onChange={(e) =>
                                        stateSetters[index](
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">未評価</option>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading
                        ? "送信中..."
                        : initialData?.id
                        ? "更新"
                        : "レビュー"}
                </button>

                {initialData?.id && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        キャンセル
                    </button>
                )}
            </div>
        </form>
    );
}
