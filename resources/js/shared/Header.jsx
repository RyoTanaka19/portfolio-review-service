import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function Header() {
    const { auth = {}, nav = [], url } = usePage().props; // usePage() から自動取得
    const user = auth.user; // ログインユーザー情報
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

                        {user && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    こんにちは、{user.name} さん
                                </span>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/advice/create"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        AI相談
                                    </Link>
                                    <Link
                                        href="/portfolio/create"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        投稿
                                    </Link>
                                </div>

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

                        {user && (
                            <div className="py-2 text-gray-500 text-sm flex flex-col gap-2">
                                <span>こんにちは、{user.name} さん</span>
                                <Link
                                    href="/advice/create"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    AI相談
                                </Link>
                                <Link
                                    href="/portfolio/create"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    投稿
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
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
