// resources/js/Components/ReviewChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Chart.js 初期化
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ReviewChart({ reviews }) {
    // reviewsが空の場合も想定
    const reviewCount = reviews?.length || 0;

    // 総合評価を計算
    const avg = (key) => {
        const vals = reviews
            .map((r) => {
                // 総合評価(rating)がない場合は計算
                if (key === "rating") {
                    const arr = [
                        r.technical,
                        r.usability,
                        r.design,
                        r.user_focus,
                    ].filter((v) => v !== null && v !== undefined);
                    return arr.length
                        ? arr.reduce((sum, v) => sum + v, 0) / arr.length
                        : 0;
                }
                return r[key] ?? 0;
            })
            .filter((v) => v !== null && v !== undefined);
        return vals.length
            ? (vals.reduce((sum, v) => sum + v, 0) / vals.length).toFixed(1)
            : 0;
    };

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
                    "rgba(107,114,128,0.7)",
                    "rgba(37,99,235,0.7)",
                    "rgba(16,185,129,0.7)",
                    "rgba(255,105,180,1)",
                    "rgba(128,0,128,1)",
                ],
                borderColor: [
                    "rgba(107,114,128,1)",
                    "rgba(37,99,235,1)",
                    "rgba(16,185,129,1)",
                    "rgba(255,105,180,1)",
                    "rgba(128,0,128,1)",
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
        scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
    };

    return <Bar data={chartData} options={chartOptions} />;
}
