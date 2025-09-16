// resources/js/Pages/Portfolios/Create.jsx
import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PortfolioForm from "@/Components/Portfolios/PortfolioForm";
import { route } from "ziggy-js";

export default function Create() {
    return (
        <AppLayout>
            <div className="flex justify-center items-center py-6 bg-gray-50 min-h-screen">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        新規投稿
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
