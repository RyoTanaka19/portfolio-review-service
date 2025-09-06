// resources/js/Home.jsx
import React, { useEffect } from "react";
import { InertiaLink } from "@inertiajs/inertia-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = ({ canLogin, canRegister }) => {
    useEffect(() => {
        AOS.init({
            once: true, // 1回だけアニメーション（上に戻っても再生しない）
            duration: 600,
            offset: 120,
            easing: "ease-out-cubic",
            disable: "mobile", // 必要ならモバイルで無効化
        });
        AOS.refresh(); // 確実に位置を計算し直す
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-blue-600">
                    ポートフォリオレビューサービス
                </h1>
            </div>

            <div className="space-x-4 mb-8">
                {canLogin && (
                    <InertiaLink
                        href={route("login")}
                        className="btn py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                        ログイン
                    </InertiaLink>
                )}
                {canRegister && (
                    <InertiaLink
                        href={route("register")}
                        className="btn py-2 px-4 bg-green-500 text-white rounded-md"
                    >
                        新規登録
                    </InertiaLink>
                )}
            </div>

            <div className="w-full max-w-3xl space-y-6 px-4">
                {items.map((it, i) => (
                    <div
                        key={i}
                        data-aos="fade-up" // アニメーションの種類
                        data-aos-delay={i * 150} // i による遅延で 1つずつ表示される
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
