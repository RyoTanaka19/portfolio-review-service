import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Line } from "react-chartjs-2";
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

export default function Access({ portfolio, accessData }) {
    const labels = accessData.map((item) => item.accessed_at);
    const counts = accessData.map((item) => item.count);

    const data = {
        labels,
        datasets: [
            {
                label: "日別ユーザーアクセス数",
                data: counts,
                borderColor: "blue",
                backgroundColor: "lightblue",
                fill: false,
            },
        ],
    };

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {portfolio.title} のアクセス数
                </h1>

                {accessData.length > 0 ? (
                    <Line
                        data={data}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: true },
                                title: {
                                    display: true,
                                    text: "日別アクセス数",
                                },
                            },
                            scales: { y: { beginAtZero: true, precision: 0 } },
                        }}
                    />
                ) : (
                    <p className="text-center text-gray-600">
                        アクセスデータがまだありません
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
