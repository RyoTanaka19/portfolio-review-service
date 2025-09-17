// PortfolioSearch.js
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import UserAutocomplete from "./AutoComplete/User";

export default function PortfolioSearch({
    allTags = [],
    filters = {},
    initialPortfolios = [],
}) {
    const [userNameFilter, setUserNameFilter] = useState(
        filters.user_name || ""
    );
    const [tagFilter, setTagFilter] = useState(filters.tag || "");
    const [portfolioList, setPortfolioList] = useState(initialPortfolios); // 検索結果のポートフォリオを管理

    // 検索処理
    const handleSearch = () => {
        // 検索条件を送信し、ポートフォリオリストを更新
        Inertia.get(
            route("portfolios.search"),
            { user_name: userNameFilter, tag: tagFilter },
            {
                preserveState: true,
                onSuccess: (page) => {
                    setPortfolioList(page.props.portfolios); // 新しい検索結果をセット
                },
            }
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* タグ検索 */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                        タグで検索
                    </label>
                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">タグを選択</option>
                        {allTags.map((tag, idx) => (
                            <option key={idx} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ユーザー名検索 - オートコンプリート */}
                <UserAutocomplete
                    userNameFilter={userNameFilter}
                    setUserNameFilter={setUserNameFilter}
                />

                {/* 検索ボタン */}
                <div className="flex items-center mt-2 md:mt-0">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        検索
                    </button>
                </div>
            </div>

            {/* 検索結果 */}
            <div className="mt-4">
                <h2 className="text-xl font-bold">検索結果</h2>
                <div className="mt-2">
                    {portfolioList.length > 0 ? (
                        <p>{portfolioList.length} 件の検索結果があります</p>
                    ) : (
                        <p>検索結果0件</p>
                    )}
                </div>
            </div>
        </div>
    );
}
