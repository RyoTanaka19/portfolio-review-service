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

    // 平均値を計算する関数
    const avg = (key) => {
        const vals = reviews
            ?.map((r) => {
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
        return vals?.length
            ? (vals.reduce((sum, v) => sum + v, 0) / vals.length).toFixed(1)
            : 0;
    };

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
                // 総合評価だけ横方向グラデーション、その他は通常カラー
                backgroundColor: (ctx) => {
                    const index = ctx.dataIndex;
                    if (index === 0) {
                        const chart = ctx.chart;
                        const gradient = chart.ctx.createLinearGradient(
                            0,
                            0,
                            chart.width,
                            0
                        );
                        gradient.addColorStop(0, "#f87171"); // red-500
                        gradient.addColorStop(0.25, "#facc15"); // yellow-500
                        gradient.addColorStop(0.5, "#22c55e"); // green-500
                        gradient.addColorStop(0.75, "#3b82f6"); // blue-500
                        gradient.addColorStop(1, "#a855f7"); // purple-500
                        return gradient;
                    }
                    return [
                        "rgba(37,99,235,0.7)",
                        "rgba(16,185,129,0.7)",
                        "rgba(255,105,180,1)",
                        "rgba(128,0,128,1)",
                    ][index - 1];
                },
                borderColor: (ctx) => {
                    const index = ctx.dataIndex;
                    if (index === 0) {
                        const chart = ctx.chart;
                        const gradient = chart.ctx.createLinearGradient(
                            0,
                            0,
                            chart.width,
                            0
                        );
                        gradient.addColorStop(0, "#f87171"); // red-500
                        gradient.addColorStop(0.25, "#facc15"); // yellow-500
                        gradient.addColorStop(0.5, "#22c55e"); // green-500
                        gradient.addColorStop(0.75, "#3b82f6"); // blue-500
                        gradient.addColorStop(1, "#a855f7"); // purple-500
                        return gradient;
                    }
                    return [
                        "rgba(37,99,235,1)",
                        "rgba(16,185,129,1)",
                        "rgba(255,105,180,1)",
                        "rgba(128,0,128,1)",
                    ][index - 1];
                },
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
