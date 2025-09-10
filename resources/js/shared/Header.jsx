import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import NotificationDropdown from "@/Components/NotificationDropdown";

export default function Header() {
    const { auth = {}, nav = [], url } = usePage().props;
    const user = auth.user;

    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => router.post(route("logout"));

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return path === new URL(url, window.location.origin).pathname;
        } catch {
            return href === url;
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                <div className="flex-1">
                    <Link href="/" className="font-bold text-lg">
                        PortfolioReview
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={
                                    isActive(item.href) ? "page" : undefined
                                }
                                className={`text-sm hover:underline ${
                                    isActive(item.href)
                                        ? "font-semibold"
                                        : "text-gray-600"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    こんにちは、{user.name} さん
                                </span>

                                {/* 通知アイコンだけ */}
                                <NotificationDropdown user={user} />

                                {/* その他ボタン */}
                                <Link
                                    href="/advices/create"
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    AI相談
                                </Link>
                                <Link
                                    href="/reviews/rankings/total"
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                >
                                    ランキング
                                </Link>
                                <Link
                                    href="/portfolios/create"
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    投稿
                                </Link>
                                <Link
                                    href={route("bookmarks.index")}
                                    className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
                                >
                                    お気に入り
                                </Link>

                                {/* ユーザードロップダウン */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        className="font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        {user.name}
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                プロフィール編集
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                ログアウト
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("login")}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    新規登録
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
