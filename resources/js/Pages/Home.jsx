import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AOS from "aos";
import "aos/dist/aos.css";
import FlashMessage from "@/Components/FlashMessage"; // FlashMessage コンポーネントをインポート

const Home = () => {
    const { auth, flash = {} } = usePage().props; // Laravel の auth.user と flash を取得
    const [flashMessage, setFlashMessage] = useState(flash.flash || ""); // flash.flash はサーバー側で設定したメッセージ

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 600,
            offset: 120,
            easing: "ease-out-cubic",
            disable: "mobile",
        });
        AOS.refresh();
    }, []);

    const items = [
        {
            title: "このサービスについて",
            body: "ポートフォリオを見せ合ってレビューがもらえるサービスです。",
        },
        {
            title: "使い方（1）",
            body: "サインアップしてポートフォリオを登録します。",
        },
        {
            title: "使い方（2）",
            body: "レビューをもらって改善・公開しましょう。",
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
            {/* フラッシュメッセージ */}
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-blue-600">
                    ポートフォリオレビューサービス
                </h1>
            </div>

            <div className="space-x-4 mb-8">
                {auth.user ? (
                    <>
                        <Link
                            href={route("logout")}
                            method="post"
                            className="btn py-2 px-4 bg-red-500 text-white rounded-md"
                        >
                            ログアウト
                        </Link>
                        <Link
                            href={route("portfolios.create")}
                            className="btn py-2 px-4 bg-green-500 text-white rounded-md"
                        >
                            ポートフォリオ投稿
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href={route("login")}
                            className="btn py-2 px-4 bg-blue-500 text-white rounded-md"
                        >
                            ログイン
                        </Link>
                        <Link
                            href={route("register")}
                            className="btn py-2 px-4 bg-green-500 text-white rounded-md"
                        >
                            新規登録
                        </Link>
                    </>
                )}

                <Link
                    href={route("portfolios.index")}
                    className="btn py-2 px-4 bg-purple-500 text-white rounded-md"
                >
                    ポートフォリオ一覧
                </Link>
            </div>

            <div className="w-full max-w-3xl space-y-6 px-4">
                {items.map((it, i) => (
                    <div
                        key={i}
                        data-aos="fade-up"
                        data-aos-delay={i * 150}
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <h3 className="text-xl font-semibold">{it.title}</h3>
                        <p className="mt-2 text-gray-600">{it.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
