import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Total({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white" // 総合にレインボーグラデーションを適用
                headerProps={{
                    title: "レビュー総合ランキング TOP10",
                    description: "総合の平均評価ランキング",
                    activeKey: "total",
                }}
            />
        </AppLayout>
    );
}
