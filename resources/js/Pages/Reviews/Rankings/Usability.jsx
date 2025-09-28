import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Usability({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                colors={{
                    rank: "text-green-600",
                    tag: "bg-green-50 text-green-700",
                    title: "text-green-600 hover:underline",
                    author: "text-green-600 hover:underline",
                    reviews: "text-green-700",
                    link: "text-green-600 hover:underline",
                }}
                headerProps={{
                    title: "使いやすさランキング TOP10",
                    description: "使いやすさの平均評価でランキング",
                    activeKey: "usability",
                }}
            />
        </AppLayout>
    );
}
