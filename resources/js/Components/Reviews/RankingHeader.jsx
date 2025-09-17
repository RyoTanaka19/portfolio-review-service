import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function RankingHeader({ title, description, activeKey }) {
    const links = [
        {
            key: "total",
            label: "総合",
            routeName: "ranking.total",
            baseColor: "gray",
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
        total: "bg-gradient-to-r from-gray-200 to-gray-100",
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
                                        ? `bg-${link.baseColor}-200 text-${link.baseColor}-900`
                                        : `bg-${link.baseColor}-100 text-${link.baseColor}-800 hover:bg-${link.baseColor}-200`
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
