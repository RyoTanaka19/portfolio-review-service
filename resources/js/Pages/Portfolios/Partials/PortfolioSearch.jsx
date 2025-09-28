import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import UserAutocomplete from "@/Components/AutoComplete/UserAutoComplete";

export default function PortfolioSearch({
    allTags = [],
    filters = {},
    portfolioList,
    setPortfolioList,
    setPagination,
}) {
    const [userNameFilter, setUserNameFilter] = useState(
        filters.user_name || ""
    );
    const [tagFilter, setTagFilter] = useState(filters.tag || "");
    const [searching, setSearching] = useState(false); // 検索中フラグを追加

    const handleSearch = () => {
        setSearching(true); // 検索中に設定

        Inertia.get(
            route("portfolios.search"),
            { user_name: userNameFilter, tag: tagFilter },
            {
                preserveState: true,
                onSuccess: (page) => {
                    const props = page.props.portfolios;
                    setPortfolioList(props.data || []);
                    setPagination({
                        current_page: props.current_page,
                        last_page: props.last_page,
                        next_page_url: props.next_page_url,
                        prev_page_url: props.prev_page_url,
                        filters: { user_name: userNameFilter, tag: tagFilter },
                    });

                    setSearching(false); // 検索が完了したら検索中フラグを解除
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

                {/* ユーザー名検索 */}
                <UserAutocomplete
                    userNameFilter={userNameFilter}
                    setUserNameFilter={setUserNameFilter}
                />

                {/* 検索ボタン */}
                <div className="flex items-center mt-2 md:mt-0">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full md:w-auto px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    >
                        検索
                    </button>
                </div>
            </div>

            {/* 検索結果 */}
            <div className="mt-4 text-center text-purple-500">
                {/* ここに text-center を追加 */}
                <h2 className="text-xl font-bold">検索結果</h2>
                <div className="mt-2">
                    {/* 検索結果が表示されるタイミングで、件数を表示 */}
                    {searching ? (
                        <p>検索中...</p> // 検索中は「検索中...」と表示
                    ) : portfolioList.length > 0 ? (
                        <p>{portfolioList.length} 件の検索結果があります</p>
                    ) : (
                        <p>検索結果0件</p>
                    )}
                </div>
            </div>
        </div>
    );
}
