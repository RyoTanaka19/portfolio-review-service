// Components/AutoComplete/User.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserAutocomplete({
    userNameFilter,
    setUserNameFilter,
}) {
    const [suggestions, setSuggestions] = useState([]);

    // ユーザー候補取得
    const fetchUserSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await axios.get("/autocomplete/users", {
                params: { query },
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("ユーザー候補取得エラー:", err);
            setSuggestions([]);
        }
    };

    const handleUserInput = (e) => {
        const value = e.target.value;
        setUserNameFilter(value);
        fetchUserSuggestions(value);
    };

    return (
        <div className="flex flex-col relative">
            <label className="text-sm font-medium mb-1">ユーザー名で検索</label>
            <input
                type="text"
                placeholder="例: Tanaka"
                value={userNameFilter}
                onChange={handleUserInput}
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 z-10 bg-white border w-full max-h-48 overflow-y-auto shadow rounded">
                    {suggestions.map((user) => (
                        <li
                            key={user.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setUserNameFilter(user.name);
                                setSuggestions([]);
                            }}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
