import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PortfolioForm from "@/Pages/Portfolios/Partials/PortfolioForm";
import { route } from "ziggy-js";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Create() {
    return (
        <AppLayout>
            <div className="flex justify-center py-10 bg-gray-100 min-h-[100vh]">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 overflow-auto">
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                        新規ポートフォリオ作成
                    </h1>
                    <PortfolioForm
                        onSubmitRoute={route("portfolios.store")}
                        method="post"
                        buttonText="投稿"
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
