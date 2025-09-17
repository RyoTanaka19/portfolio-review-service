import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Components/RankingList";

export default function TotalRanking({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-gray-50 text-gray-700"
                headerProps={{
                    title: "レビュー総合ランキング TOP10",
                    description: "総合の平均評価ランキング",
                    activeKey: "total",
                }}
            />
        </AppLayout>
    );
}
