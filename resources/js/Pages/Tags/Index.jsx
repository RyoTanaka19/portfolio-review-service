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

    // API URL (Ziggy の route() が使えるなら route('tags.index') に置き換え)
    const tagsIndexUrl =
        typeof route === "function" ? route("tags.index") : "/tags";

    useEffect(() => {
        axios
            .get(tagsIndexUrl)
            .then((r) => setAllTags(r.data))
            .catch((e) => console.error(e));
    }, []);

    // value prop が変わったときに同期
    useEffect(() => {
        setSelected(value);
    }, [value]);

    // selected 変化を親へ通知
    useEffect(() => {
        onChange && onChange(selected);
    }, [selected]);

    // クリック外で閉じる
    useEffect(() => {
        const onDoc = (e) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    const filtered = allTags
        .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
        .filter((t) => !selected.some((s) => s.id === t.id));

    const toggleTag = (tag) => {
        if (selected.some((s) => s.id === tag.id)) {
            setSelected(selected.filter((s) => s.id !== tag.id));
        } else {
            setSelected([...selected, tag]);
        }
        setQuery("");
        setOpen(false);
    };

    const removeTag = (tag) => {
        setSelected(
            selected.filter((s) => (s.id ?? s.name) !== (tag.id ?? tag.name))
        );
    };

    return (
        <div ref={rootRef} className="relative">
            {/* 選択済みタグ */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selected.map((tag) => (
                    <span
                        key={tag.id ?? tag.name}
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

            {/* 入力欄（検索専用） */}
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="タグを検索して選択"
                className="w-full border px-3 py-2 rounded"
            />

            {/* ドロップダウン */}
            {open && filtered.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded mt-1 max-h-48 overflow-auto shadow">
                    {filtered.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTag(t)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
