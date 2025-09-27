import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import RankingList from "@/Pages/Review/Rankings/Partials/RankingList";

export default function UserFocus({ portfolios }) {
    return (
        <AppLayout>
            <RankingList
                portfolios={portfolios}
                tagColor="bg-purple-50 text-purple-700" // ユーザー目線に合わせたカラー
                headerProps={{
                    title: "ユーザー目線ランキング TOP10",
                    description: "ユーザー目線の平均評価でランキング",
                    activeKey: "user-focus",
                }}
            />
        </AppLayout>
    );
}
