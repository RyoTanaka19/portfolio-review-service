import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PortfolioForm from "@/Pages/Portfolios/Partials/PortfolioForm";
import { route } from "ziggy-js";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Edit({ portfolio }) {
    return (
        <AppLayout>
            <div className="flex justify-center py-10 bg-gray-100 min-h-[100vh]">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 overflow-auto">
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                        ポートフォリオ編集
                    </h1>
                    <PortfolioForm
                        initialData={portfolio}
                        onSubmitRoute={route("portfolios.update", portfolio.id)}
                        method="put"
                        buttonText="更新"
                    />

                    {/* 一覧に戻る */}
                    <div className="text-center mt-8">
                        <InertiaLink
                            href="/portfolios"
                            className="inline-block px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            一覧に戻る
                        </InertiaLink>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
