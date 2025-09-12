import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Line, Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

export default function Access({ portfolio, accessData, tagAccessData }) {
    // --- 折れ線グラフ（日別アクセス数）
    const lineLabels = accessData.map((item) => item.accessed_at);
    const lineCounts = accessData.map((item) => item.count);

    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: "日別ユーザーアクセス数",
                data: lineCounts,
                borderColor: "blue",
                backgroundColor: "lightblue",
                fill: false,
            },
        ],
    };

    // --- 散布図（タグ別アクセス傾向）
    const scatterData = {
        datasets: tagAccessData.map((tag, index) => ({
            label: tag.tag_name,
            data: [
                {
                    x: index + 1, // X軸: タグを並べる位置
                    y: tag.user_count, // Y軸: アクセスしたユーザー数
                },
            ],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        })),
    };

    const scatterOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: "bottom" },
            title: {
                display: true,
                text: "タグ別アクセス傾向（どのタグのユーザーがアクセスしやすいか）",
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const dataset = context.dataset;
                        return `${dataset.label}: ${context.parsed.y}人`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: "タグ" },
                ticks: {
                    callback: (value, index) =>
                        tagAccessData[index]?.tag_name || "",
                },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "ユーザー数" },
                precision: 0,
            },
        },
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {portfolio.title} のアクセス分析
                </h1>

                {/* 折れ線グラフ */}
                <div className="mb-12">
                    {accessData.length > 0 ? (
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                    title: {
                                        display: true,
                                        text: "日別アクセス数",
                                    },
                                },
                                scales: {
                                    y: { beginAtZero: true, precision: 0 },
                                },
                            }}
                        />
                    ) : (
                        <p className="text-center text-gray-600">
                            アクセスデータがまだありません
                        </p>
                    )}
                </div>

                {/* 散布図 */}
                <div>
                    {tagAccessData.length > 0 ? (
                        <Scatter data={scatterData} options={scatterOptions} />
                    ) : (
                        <p className="text-center text-gray-600">
                            タグ別アクセスデータがまだありません
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
