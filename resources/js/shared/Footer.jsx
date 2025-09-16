import { usePage, Link } from "@inertiajs/react";

export default function Footer({ className = "" }) {
    const { footer = {} } = usePage().props;
    const year = new Date().getFullYear();

    return (
        <div className={`border-t bg-white ${className}`}>
            <div className="mx-auto max-w-6xl px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* 左側: コピーライト */}
                    <div className="text-sm text-gray-500">
                        {footer.company ??
                            "@PortfolioReview. All rights reserved."}{" "}
                        © {year}
                    </div>

                    {/* 右側: リンク */}
                    <div className="flex space-x-4 text-sm">
                        <Link href="/terms" className="hover:underline">
                            利用規約
                        </Link>
                        <Link href="/privacy" className="hover:underline">
                            プライバシーポリシー
                        </Link>
                        <Link href="/contact" className="hover:underline">
                            お問い合わせ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
