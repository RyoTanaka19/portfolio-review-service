import React from "react";

export default function Pagination({ pagination, onPageChange }) {
    return (
        <div className="flex justify-center gap-4 mt-6">
            <button
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={!pagination.prev_page_url}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
                前へ
            </button>
            <span>
                {pagination.current_page} / {pagination.last_page}
            </span>
            <button
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={!pagination.next_page_url}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
                次へ
            </button>
        </div>
    );
}
