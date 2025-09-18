import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Components/Reviews/RankingList";

export default function Design({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-pink-50 text-pink-700"
                headerProps={{
                    title: "デザイン性ランキング TOP10",
                    description: "デザイン性の平均評価でランキング",
                    activeKey: "design",
                }}
            />
        </AppLayout>
    );
}
