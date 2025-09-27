import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Review/Rankings/Partials/RankingList";

export default function Design({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-pink-50 text-pink-700" // デザイン性に合わせたカラー
                headerProps={{
                    title: "デザイン性ランキング TOP10",
                    description: "デザイン性の平均評価でランキング",
                    activeKey: "design",
                }}
            />
        </AppLayout>
    );
}
