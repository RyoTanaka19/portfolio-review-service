// resources/js/Pages/Portfolios/Edit.jsx
import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PortfolioForm from "@/Components/Portfolios/PortfolioForm";
import { route } from "ziggy-js";

export default function Edit({ portfolio }) {
    return (
        <AppLayout>
            <div className="flex justify-center items-center py-6 bg-gray-50 min-h-screen">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        ポートフォリオ編集
                    </h1>
                    <PortfolioForm
                        initialData={portfolio}
                        onSubmitRoute={route("portfolios.update", portfolio.id)}
                        method="put"
                        buttonText="更新"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
