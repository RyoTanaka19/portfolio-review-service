import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function RankingHeader({ title, description, activeKey }) {
    // リンクの情報
    const links = [
        {
            key: "total",
            label: "総合",
            routeName: "ranking.total",
            baseColor:
                "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-black rounded text-sm",
            rainbow: true, // 総合はレインボーカラーにする
        },
        {
            key: "technical",
            label: "技術力",
            routeName: "ranking.technical",
            baseColor: "blue",
        },
        {
            key: "usability",
            label: "使いやすさ",
            routeName: "ranking.usability",
            baseColor: "green",
        },
        {
            key: "design",
            label: "デザイン性",
            routeName: "ranking.design",
            baseColor: "pink",
        },
        {
            key: "user-focus",
            label: "ユーザー目線",
            routeName: "ranking.user-focus",
            baseColor: "purple",
        },
    ];

    // activeKey に応じた背景グラデーション
    const gradientBg = {
        total: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500", // レインボー
        technical: "bg-gradient-to-r from-blue-200 to-blue-100",
        usability: "bg-gradient-to-r from-green-200 to-green-100",
        design: "bg-gradient-to-r from-pink-200 to-pink-100",
        "user-focus": "bg-gradient-to-r from-purple-200 to-purple-100",
    };

    return (
        <header
            className={`px-8 py-8 shadow text-center ${gradientBg[activeKey]}`}
        >
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-gray-600 mt-2 text-base">{description}</p>

            <div className="mt-4 flex justify-center gap-4 flex-wrap">
                {links.map((link) => {
                    const isActive = link.key === activeKey;
                    return (
                        <Link
                            key={link.key}
                            href={route(link.routeName)}
                            className={`px-4 py-2 rounded-full text-sm font-medium
                                ${
                                    isActive
                                        ? `bg-${link.baseColor}-500 text-white`
                                        : `bg-${link.baseColor}-200 text-${link.baseColor}-900 hover:bg-${link.baseColor}-300`
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
