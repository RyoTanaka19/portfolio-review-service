import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";

const Home = ({ canLogin, canRegister }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-blue-600">
                    ポートフォリオレビューサービス
                </h1>
            </div>

            <div className="space-x-4">
                {canLogin && (
                    <InertiaLink
                        href={route("login")}
                        className="btn py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        ログイン
                    </InertiaLink>
                )}
                {canRegister && (
                    <InertiaLink
                        href={route("register")}
                        className="btn py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        新規登録
                    </InertiaLink>
                )}
            </div>
        </div>
    );
};

export default Home;
