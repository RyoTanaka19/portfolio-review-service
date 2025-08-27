import Header from "../Shared/Header";
import Footer from "../Shared/Footer";

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* ヘッダー */}
            <Header />

            {/* ページコンテンツ */}
            <main className="flex-1">{children}</main>

            {/* フッター（常に画面下） */}
            <Footer />
        </div>
    );
}
