import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Components/Reviews/RankingList";

export default function UserFocus({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-purple-50 text-purple-700"
                headerProps={{
                    title: "ユーザー目線ランキング TOP10",
                    description: "ユーザー目線の平均評価でランキング",
                    activeKey: "user-focus",
                }}
            />
        </AppLayout>
    );
}
