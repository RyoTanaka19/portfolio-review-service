import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Review/Rankings/Partials/RankingList";

export default function Technical({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-blue-50 text-blue-700" // 技術力に合わせたカラー
                headerProps={{
                    title: "技術力ランキング TOP10",
                    description: "技術力の平均評価でランキング",
                    activeKey: "technical",
                }}
            />
        </AppLayout>
    );
}
