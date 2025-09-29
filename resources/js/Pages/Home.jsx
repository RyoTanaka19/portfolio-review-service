import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AOS from "aos";
import "aos/dist/aos.css";
import FlashMessage from "@/Components/FlashMessage/FlashMessage";

const Home = () => {
    const { auth, flash = {} } = usePage().props;
    const [flashMessage, setFlashMessage] = useState(flash.flash || "");

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
            body: "ポートフォリオを見せ合い、レビューをもらうことで、ポートフォリオのさらなる向上を目指すサービスです。",
        },
        {
            title: "ポートフォリオ",
            body: "あなたの熱意を込めて作成したポートフォリオを公開しましょう。",
            images: [
                "/image/program-routine-mate.png",
                "/image/portfolio-review-service.png",
            ],
        },
        {
            title: "あなたも早速投稿してみましょう!!",
            body: (
                <span className="flex items-center gap-2">
                    レビューをもらって改善・公開しましょう。
                    <span className="animate-bounce text-xl">↑</span>
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-purple-600">
                    ポートフォリオレビューサービス
                </h1>
            </div>

            <div className="space-x-4 mb-12">
                {auth.user ? (
                    <Link
                        href={route("portfolios.create")}
                        className="btn py-2 px-4 bg-blue-400 text-white rounded-md"
                    >
                        ポートフォリオ投稿
                    </Link>
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

            {/* 未ログイン時のみアニメーション表示 */}
            {!auth.user && (
                <div className="w-full max-w-5xl space-y-12 px-6">
                    {items.map((it, i) => (
                        <div
                            key={i}
                            data-aos="fade-up"
                            data-aos-delay={i * 150}
                            className={`flex flex-col md:flex-row items-center bg-white p-8 rounded-2xl shadow-lg gap-8 ${
                                i % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            {/* テキスト部分 */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-purple-600">
                                    {it.title}
                                </h3>
                                <div className="mt-3 text-gray-700 leading-relaxed text-lg">
                                    {it.body}
                                </div>
                            </div>

                            {/* 画像がある場合 */}
                            {it.images && (
                                <div className="flex-1 flex justify-center gap-4 flex-wrap">
                                    {it.images.map((src, idx) => (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`${it.title}-${idx}`}
                                            className="w-60 h-auto rounded-xl shadow-md border border-gray-200"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
