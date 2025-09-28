import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Design({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                colors={{
                    rank: "text-pink-600",
                    tag: "bg-pink-50 text-pink-700",
                    title: "text-pink-600 hover:underline",
                    author: "text-pink-600 hover:underline",
                    reviews: "text-pink-700",
                    link: "text-pink-600 hover:underline",
                }}
                headerProps={{
                    title: "デザイン性ランキング TOP10",
                    description: "デザイン性の平均評価でランキング",
                    activeKey: "design",
                }}
            />
        </AppLayout>
    );
}
