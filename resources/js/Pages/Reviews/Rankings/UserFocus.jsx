import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function UserFocus({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                colors={{
                    rank: "text-purple-600",
                    tag: "bg-purple-50 text-purple-700",
                    title: "text-purple-600 hover:underline",
                    author: "text-purple-600 hover:underline",
                    reviews: "text-purple-700",
                    link: "text-purple-600 hover:underline",
                }}
                headerProps={{
                    title: "ユーザー目線ランキング TOP10",
                    description: "ユーザー目線の平均評価でランキング",
                    activeKey: "user-focus",
                }}
            />
        </AppLayout>
    );
}
