import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Show({ portfolio }) {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                {/* タイトル */}
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {portfolio.title}
                </h1>

                {/* 説明 */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">
                        作品説明
                    </h2>
                    <p className="text-gray-600">{portfolio.description}</p>
                </div>

                {/* URL */}
                {portfolio.url && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">
                            作品URL
                        </h2>
                        <a
                            href={portfolio.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                        >
                            {portfolio.url}
                        </a>
                    </div>
                )}

                {/* 戻るボタン */}
                <div className="text-center">
                    <InertiaLink
                        href="/portfolio"
                        className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        一覧に戻る
                    </InertiaLink>
                </div>
            </div>
        </div>
    );
}
