import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

/**
 * props:
 *  - value: [{id, name}, ...] (初期選択タグ)
 *  - onChange: function(selectedTagsArray)
 */
export default function TagsInput({ value = [], onChange }) {
    const [allTags, setAllTags] = useState([]);
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const tagsIndexUrl =
        typeof route === "function" ? route("tags.index") : "/tags";

    const fetchTags = async () => {
        try {
            const response = await axios.get(tagsIndexUrl);
            const data = response.data;

            if (Array.isArray(data)) setAllTags(data);
            else if (Array.isArray(data.tags)) setAllTags(data.tags);
            else console.error("タグ配列が取得できませんでした");
        } catch (error) {
            console.error("タグ取得エラー:", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    useEffect(() => {
        onChange && onChange(selected);
    }, [selected]);

    // クリック外でドロップダウンを閉じる
    useEffect(() => {
        const onDoc = (e) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    // ドロップダウンに表示するタグをフィルタ
    const filtered = allTags
        .filter((t) => !selected.some((s) => s.id === t.id)) // 選択済みは除外
        .filter((t) =>
            query ? t.name.toLowerCase().includes(query.toLowerCase()) : true
        );

    // タグ選択
    const toggleTag = (tag) => {
        if (!selected.some((s) => s.id === tag.id)) {
            setSelected([...selected, tag]);
        }
        setQuery("");
    };

    // タグ削除
    const removeTag = (tag) => {
        setSelected(
            selected.filter((s) =>
                tag.id ? s.id !== tag.id : s.name !== tag.name
            )
        );
    };

    return (
        <div ref={rootRef} className="relative">
            {/* 選択済みタグ */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selected.map((tag) => (
                    <span
                        key={tag.id || tag.name}
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-sm leading-none"
                            aria-label={`remove-${tag.name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* 入力欄 */}
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="タグを選択"
                className="w-full border px-3 py-2 rounded cursor-pointer"
                readOnly={false}
            />

            {/* ドロップダウン */}
            {open && filtered.length >= 0 && (
                <div className="absolute z-50 w-full bg-white border rounded mt-1 max-h-48 overflow-auto shadow">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500">
                            タグはありません
                        </div>
                    ) : (
                        filtered.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => toggleTag(t)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100"
                            >
                                {t.name}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
