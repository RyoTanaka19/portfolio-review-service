import React, { useState } from "react";
import axios from "axios";

export default function ReviewForm({ portfolio, onSuccess }) {
    const [comment, setComment] = useState("");
    const [technical, setTechnical] = useState(null);
    const [usability, setUsability] = useState(null);
    const [design, setDesign] = useState(null);
    const [userFocus, setUserFocus] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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

        // 全て未評価の場合はフロントでバリデーション
        if (
            [technical, usability, design, userFocus].every((v) => v === null)
        ) {
            setErrors({ general: "いずれかの評価を入力してください" });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
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

            if (response.data.success) {
                if (onSuccess) onSuccess(response.data.review);

                // フォーム初期化
                setComment("");
                setTechnical(null);
                setUsability(null);
                setDesign(null);
                setUserFocus(null);
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

            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "送信中..." : "レビュー"}
            </button>
        </form>
    );
}
