import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
} from "chart.js";
import { FaChartLine, FaTags } from "react-icons/fa";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
);

export default function Index({ portfolio, accessData, tagAccessData }) {
    // --- 日別アクセス数（折れ線） ---
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
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" },
            title: {
                display: true,
                text: "日別アクセス数",
                font: { size: 18 },
            },
            tooltip: { mode: "index", intersect: false },
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        scales: {
            x: {
                offset: false, // 左端にデータを寄せる
                ticks: {
                    maxRotation: 45,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                grid: { color: "#e0e0e0" },
            },
            y: {
                beginAtZero: true,
                precision: 0,
                grid: { color: "#f0f0f0" },
            },
        },
    };

    // --- タグ別アクセス数（横棒グラフ） ---
    const barData = {
        labels: tagAccessData.map((tag) => tag.tag_name),
        datasets: [
            {
                label: "アクセスユーザー数",
                data: tagAccessData.map((tag) => tag.user_count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        indexAxis: "y", // 横棒グラフにする
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" },
            title: {
                display: true,
                text: "タグ別アクセス数",
                font: { size: 18 },
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label}: ${context.parsed.x}人`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                title: { display: true, text: "ユーザー数" },
                precision: 0,
            },
            y: { title: { display: true, text: "タグ" } },
        },
    };

    const EmptyMessageBox = ({ icon, message }) => (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded shadow">
            <div className="text-4xl text-gray-400 mb-4">{icon}</div>
            <p className="text-gray-500 text-lg text-center px-4">{message}</p>
        </div>
    );

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
                    {portfolio.title} のアクセス分析
                </h1>

                {/* 日別アクセス数グラフ */}
                <div>
                    {accessData.length > 0 ? (
                        <Line
                            data={lineData}
                            options={lineOptions}
                            className="h-80"
                        />
                    ) : (
                        <EmptyMessageBox
                            icon={<FaChartLine />}
                            message="アクセスデータがまだありません"
                        />
                    )}
                </div>

                {/* タグ別アクセス数グラフ */}
                <div>
                    {tagAccessData.length > 0 ? (
                        <Bar
                            data={barData}
                            options={barOptions}
                            className="h-96"
                        />
                    ) : (
                        <EmptyMessageBox
                            icon={<FaTags />}
                            message="タグ別アクセスデータがまだありません"
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
