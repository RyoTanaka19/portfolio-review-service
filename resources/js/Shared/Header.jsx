import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NotificationDropdown from "../Components/Notification/NotificationDropdown";

export default function Header() {
    const { auth = {}, nav = [], url } = usePage().props;
    const [currentUser, setCurrentUser] = useState(auth?.user || null);
    const [dropdownOpen, setDropdownOpen] = useState(false); // ユーザードロップダウン
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ハンバーガーメニュー

    const handleLogout = () => router.post(route("logout"));

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return path === new URL(url, window.location.origin).pathname;
        } catch {
            return href === url;
        }
    };

    useEffect(() => {
        const handler = (e) => setCurrentUser(e.detail);
        window.addEventListener("user-updated", handler);
        return () => window.removeEventListener("user-updated", handler);
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                {/* 左側：ロゴ */}
                <div className="flex-1">
                    <Link
                        href="/"
                        className="font-bold text-lg text-purple-500"
                    >
                        PortfolioReview
                    </Link>
                </div>

                {/* ハンバーガーメニュー（スマホ） */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 hover:text-gray-900"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* PCナビゲーション */}
                <nav className="hidden md:flex items-center gap-4">
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

                    {currentUser ? (
                        <>
                            <span className="text-sm text-gray-500">
                                こんにちは、{currentUser.name} さん
                            </span>
                            <NotificationDropdown user={currentUser} />
                            <Link
                                href="/portfolios/create"
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                投稿
                            </Link>
                            <Link
                                href="/portfolios"
                                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                            >
                                投稿一覧
                            </Link>
                            <Link
                                href="/advices/create"
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                                AI相談
                            </Link>
                            <Link
                                href="/review/rankings/total"
                                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                            >
                                ランキング
                            </Link>
                            <Link
                                href={route("bookmarks.index")}
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
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
                                    {currentUser.name}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                                        <Link
                                            href={route(
                                                "profile.show",
                                                currentUser.id
                                            )}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            マイページ
                                        </Link>
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
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </nav>
            </div>

            {/* モバイルメニュー */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-md">
                    <div className="flex flex-col px-4 py-2 space-y-2">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm hover:underline ${
                                    isActive(item.href)
                                        ? "font-semibold"
                                        : "text-gray-600"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {currentUser ? (
                            <>
                                <span className="text-sm text-gray-500">
                                    こんにちは、{currentUser.name} さん
                                </span>
                                <Link
                                    href="/portfolios/create"
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    投稿
                                </Link>
                                <Link
                                    href="/portfolios"
                                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    投稿一覧
                                </Link>
                                <Link
                                    href="/advices/create"
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    AI相談
                                </Link>
                                <Link
                                    href="/review/rankings/total"
                                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ランキング
                                </Link>
                                <Link
                                    href={route("bookmarks.index")}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    お気に入り
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-1 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    ログアウト
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
