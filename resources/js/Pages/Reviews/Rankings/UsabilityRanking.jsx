import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Components/RankingList";

export default function UsabilityRanking({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-green-50 text-green-700"
                headerProps={{
                    title: "使いやすさランキング TOP10",
                    description: "使いやすさの平均評価でランキング",
                    activeKey: "usability",
                }}
            />
        </AppLayout>
    );
}
