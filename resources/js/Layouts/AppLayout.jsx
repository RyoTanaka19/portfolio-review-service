import Header from "../Shared/Header.jsx";
import Footer from "../Shared/Footer.jsx";

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen relative">
            {/* ヘッダー */}
            <Header />

            {/* ページコンテンツ */}
            <main className="flex-1 pb-24">{children}</main>
            {/* ↑ pb-24でフッター分の余白を確保 */}

            {/* フッター（画面下に固定） */}
            <Footer className="fixed bottom-0 left-0 w-full z-50" />
        </div>
    );
}
