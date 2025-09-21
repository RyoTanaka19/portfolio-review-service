import Header from "@/Shared/Header.jsx";
import Footer from "@/Shared/Footer.jsx";

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen relative">
            <Header />
            <main className="flex-1 pb-24">{children}</main>
            <Footer className="fixed bottom-0 left-0 w-full z-50" />
        </div>
    );
}
