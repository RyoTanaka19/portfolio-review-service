import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Components/RankingList";

export default function TechnicalRanking({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-blue-50 text-blue-700"
                headerProps={{
                    title: "技術力ランキング TOP10",
                    description: "技術力の平均評価でランキング",
                    activeKey: "technical",
                }}
            />
        </AppLayout>
    );
}
