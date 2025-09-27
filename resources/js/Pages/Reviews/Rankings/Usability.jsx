import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Reviews/Rankings/Partials/RankingList";

export default function Usability({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-green-50 text-green-700" // 使いやすさに合わせたカラー
                headerProps={{
                    title: "使いやすさランキング TOP10",
                    description: "使いやすさの平均評価でランキング",
                    activeKey: "usability",
                }}
            />
        </AppLayout>
    );
}
