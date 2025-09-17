import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PortfolioForm from "@/Components/Portfolios/PortfolioForm";
import { route } from "ziggy-js";

export default function Create() {
    return (
        <AppLayout>
            <div className="flex justify-center py-10 bg-gray-100 min-h-[100vh]">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 overflow-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        新規ポートフォリオ作成
                    </h1>
                    <PortfolioForm
                        onSubmitRoute={route("portfolios.store")}
                        method="post"
                        buttonText="投稿"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
