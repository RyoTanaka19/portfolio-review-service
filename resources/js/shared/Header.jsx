import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Header() {
    const { auth = {}, nav = [], url } = usePage().props;
    const user = auth.user;

    const [open, setOpen] = useState(false); // モバイルメニュー
    const [dropdownOpen, setDropdownOpen] = useState(false); // ユーザードロップダウン
    const [notifOpen, setNotifOpen] = useState(false); // 通知ドロップダウン
    const [notifications, setNotifications] = useState([]);

    const handleLogout = () => router.post(route("logout"));

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return path === new URL(url, window.location.origin).pathname;
        } catch {
            return href === url;
        }
    };

    // 通知取得
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await axios.get("/notifications");
            setNotifications(res.data.notifications);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // 5秒ごとに更新
        return () => clearInterval(interval);
    }, [user]);

    // 通知既読化
    const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/read`);
            setNotifications(notifications.filter((n) => n.id !== id));
        } catch (error) {
            console.error(error);
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
                    {/* PCナビ */}
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
                            // ログイン時
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    こんにちは、{user.name} さん
                                </span>

                                {/* 通知アイコン */}
                                <div className="relative">
                                    <button
                                        onClick={() => setNotifOpen(!notifOpen)}
                                        className="relative"
                                    >
                                        🔔
                                        {notifications.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </button>
                                    {notifOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-md z-50">
                                            {notifications.length === 0 && (
                                                <p className="p-3 text-gray-500">
                                                    通知はありません
                                                </p>
                                            )}
                                            {notifications.map((n) => {
                                                const data =
                                                    typeof n.data === "string"
                                                        ? JSON.parse(n.data)
                                                        : n.data;
                                                return (
                                                    <div
                                                        key={n.id}
                                                        className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                                        onClick={() =>
                                                            markAsRead(n.id)
                                                        }
                                                    >
                                                        <div className="font-medium">
                                                            {data.message}
                                                        </div>
                                                        {data.rating && (
                                                            <div className="text-sm text-gray-400">
                                                                評価:{" "}
                                                                {data.rating} /
                                                                5
                                                            </div>
                                                        )}
                                                        {data.comment && (
                                                            <div className="text-sm text-gray-500">
                                                                {data.comment}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* AI相談 / ランキング / 投稿 / お気に入り */}
                                <div className="flex items-center gap-2">
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
                                </div>

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
                            // 未ログイン時
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

                    {/* モバイルメニュー */}
                    <button
                        className="md:hidden inline-flex items-center rounded-xl border px-3 py-2 text-sm"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                    >
                        メニュー
                    </button>
                </div>
            </div>

            {/* モバイルドロワー */}
            {open && (
                <div id="mobile-nav" className="md:hidden border-t bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`py-2 ${
                                    isActive(item.href)
                                        ? "font-semibold"
                                        : "text-gray-700"
                                }`}
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {user ? (
                            <div className="py-2 text-gray-500 text-sm flex flex-col gap-2">
                                <span>こんにちは、{user.name} さん</span>
                                <Link
                                    href="/advice/create"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    AI相談
                                </Link>
                                <Link
                                    href={route("ranking")}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    ランキング
                                </Link>
                                <Link
                                    href="/portfolio/create"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    投稿
                                </Link>
                                <Link
                                    href={route("bookmarks.index")}
                                    className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                                >
                                    お気に入り
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    プロフィール編集
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    ログアウト
                                </button>
                            </div>
                        ) : (
                            <div className="py-2 text-gray-500 text-sm flex flex-col gap-2">
                                <Link
                                    href={route("login")}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    新規登録
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
