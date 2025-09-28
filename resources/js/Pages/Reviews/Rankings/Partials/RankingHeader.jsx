import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function RankingHeader({ title, description, activeKey }) {
    // リンク情報とクラスをオブジェクトで安全に管理
    const links = [
        {
            key: "total",
            label: "総合",
            routeName: "ranking.total",
            classes: {
                active: "bg-orange-500 text-white",
                inactive: "bg-orange-200 text-orange-900 hover:bg-orange-300",
            },
        },
        {
            key: "technical",
            label: "技術力",
            routeName: "ranking.technical",
            classes: {
                active: "bg-blue-500 text-white",
                inactive: "bg-blue-200 text-blue-900 hover:bg-blue-300",
            },
        },
        {
            key: "usability",
            label: "使いやすさ",
            routeName: "ranking.usability",
            classes: {
                active: "bg-green-500 text-white",
                inactive: "bg-green-200 text-green-900 hover:bg-green-300",
            },
        },
        {
            key: "design",
            label: "デザイン性",
            routeName: "ranking.design",
            classes: {
                active: "bg-pink-500 text-white",
                inactive: "bg-pink-200 text-pink-900 hover:bg-pink-300",
            },
        },
        {
            key: "user-focus",
            label: "ユーザー目線",
            routeName: "ranking.user-focus",
            classes: {
                active: "bg-purple-500 text-white",
                inactive: "bg-purple-200 text-purple-900 hover:bg-purple-300",
            },
        },
    ];

    // ヘッダー背景のグラデーション
    const gradientBg = {
        total: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
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
                    const classNames = isActive
                        ? link.classes.active
                        : link.classes.inactive;

                    return (
                        <Link
                            key={link.key}
                            href={route(link.routeName)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${classNames}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
