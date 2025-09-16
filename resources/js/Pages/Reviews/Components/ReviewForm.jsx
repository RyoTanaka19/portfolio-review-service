import React, { useState } from "react";
import axios from "axios";

export default function ReviewForm({ portfolio, onSuccess }) {
    const [comment, setComment] = useState("");
    const [technical, setTechnical] = useState(5);
    const [usability, setUsability] = useState(5);
    const [design, setDesign] = useState(5);
    const [userFocus, setUserFocus] = useState(5);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const rating = Math.round((technical + usability + design + userFocus) / 4);

    const submitReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                `/portfolio/${portfolio.id}/reviews`,
                {
                    rating,
                    comment,
                    technical,
                    usability,
                    design,
                    user_focus: userFocus,
                },
                {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                }
            );

            if (response.data.success) {
                // 親コンポーネントにレビューを渡す
                if (onSuccess) onSuccess(response.data.review);

                // フォーム初期化
                setComment("");
                setTechnical(5);
                setUsability(5);
                setDesign(5);
                setUserFocus(5);
            }
        } catch (error) {
            if (error.response?.data) {
                // バリデーションエラー表示
                setErrors(error.response.data.errors || {});
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
                    value={rating}
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
                                    value={stateValues[index]}
                                    onChange={(e) =>
                                        stateSetters[index](
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
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
