import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Technical({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                colors={{
                    rank: "text-blue-600",
                    tag: "bg-blue-50 text-blue-700",
                    title: "text-blue-600 hover:underline",
                    author: "text-blue-600 hover:underline",
                    reviews: "text-blue-700",
                    link: "text-blue-600 hover:underline",
                }}
                headerProps={{
                    title: "技術力ランキング TOP10",
                    description: "技術力の平均評価でランキング",
                    activeKey: "technical",
                }}
            />
        </AppLayout>
    );
}
