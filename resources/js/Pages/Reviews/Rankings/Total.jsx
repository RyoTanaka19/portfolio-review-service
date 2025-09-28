import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Total({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                colors={{
                    rank: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent",
                    tag: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white",
                    title: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:underline",
                    author: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:underline",
                    reviews:
                        "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent",
                    score: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent", // ← 数字部分をレインボーに
                    link: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:underline",
                }}
                headerProps={{
                    title: "レビュー総合ランキング TOP10",
                    description: "総合の平均評価ランキング",
                    activeKey: "total",
                }}
            />
        </AppLayout>
    );
}
