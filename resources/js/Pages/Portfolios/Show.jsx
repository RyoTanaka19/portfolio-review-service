import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import ReviewIndex from "../Reviews/Index";
import AppLayout from "@/Layouts/AppLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Chart.js 初期化
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Show({ portfolio, auth, errors, flash }) {
    const reviewCount = portfolio.reviews?.length || 0;

    // 各評価の平均計算
    const avg = (key) =>
        reviewCount
            ? (
                  portfolio.reviews.reduce((sum, r) => sum + (r[key] || 0), 0) /
                  reviewCount
              ).toFixed(1)
            : 0;

    // Chart.js データ
    const chartData = {
        labels: [
            "総合評価",
            "技術力",
            "使いやすさ",
            "デザイン性",
            "ユーザー目線",
        ],
        datasets: [
            {
                label: "平均点",
                data: [
                    avg("rating"),
                    avg("technical"),
                    avg("usability"),
                    avg("design"),
                    avg("user_focus"),
                ],
                backgroundColor: [
                    "rgba(107, 114, 128, 0.7)", // 総合評価: グレー
                    "rgba(37, 99, 235, 0.7)", // 技術力: ブルー
                    "rgba(16, 185, 129, 0.7)", // 使いやすさ: グリーン
                    "rgba(234, 179, 8, 0.7)", // デザイン性: イエロー
                    "rgba(239, 68, 68, 0.7)", // ユーザー目線: レッド
                ],
                borderColor: [
                    "rgba(107, 114, 128, 1)",
                    "rgba(37, 99, 235, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(234, 179, 8, 1)",
                    "rgba(239, 68, 68, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "レビュー平均スコア",
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: { stepSize: 1 },
            },
        },
    };

    return (
        <AppLayout auth={auth}>
            <div className="flex flex-col flex-1 bg-gray-100">
                <div className="flex-1 flex justify-center py-10 px-4">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                        {/* タイトル */}
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            {portfolio.title}
                        </h1>

                        {/* 画像 */}
                        {portfolio.image_url && (
                            <div className="mb-6 flex justify-center">
                                <img
                                    src={portfolio.image_url}
                                    alt={portfolio.title}
                                    className="w-full max-w-md object-cover rounded"
                                />
                            </div>
                        )}

                        {/* 作品説明 */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                作品説明
                            </h2>
                            <p className="text-gray-600">
                                {portfolio.description}
                            </p>
                        </div>

                        {/* 作品URL */}
                        {portfolio.url && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    作品URL
                                </h2>
                                <a
                                    href={portfolio.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline break-all"
                                >
                                    {portfolio.url}
                                </a>
                            </div>
                        )}

                        {/* タグ */}
                        {portfolio.tags && portfolio.tags.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                                    タグ
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.tags.map((tag, idx) => (
                                        <InertiaLink
                                            key={idx}
                                            href={route("dashboard", { tag })}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:bg-blue-200"
                                        >
                                            {tag}
                                        </InertiaLink>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chart.js */}
                        {reviewCount > 0 && (
                            <div className="mb-8">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        )}

                        {/* レビュー */}
                        <ReviewIndex
                            portfolio={portfolio}
                            auth={auth}
                            errors={errors}
                            flash={flash}
                        />

                        {/* 一覧に戻る */}
                        <div className="text-center mt-8">
                            <InertiaLink
                                href="/portfolio"
                                className="inline-block px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                一覧に戻る
                            </InertiaLink>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
