import React, { useState, useEffect, createContext, useContext } from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import FlashMessage from "@/Components/FlashMessage";

// フラッシュ用コンテキストを作成
const FlashContext = createContext();
export const useFlash = () => useContext(FlashContext);

export default function AppLayout({ children, flash = {} }) {
    const [flashMessage, setFlashMessage] = useState({
        message: flash.success || flash.error || null,
        type: flash.success ? "success" : flash.error ? "error" : null,
    });

    // props flash が更新された場合も反映
    useEffect(() => {
        if (flash.success || flash.error) {
            setFlashMessage({
                message: flash.success || flash.error || null,
                type: flash.success ? "success" : "error",
            });
        }
    }, [flash]);

    // 子コンポーネントからフラッシュを更新できる関数
    const setFlash = (message, type = "success") => {
        setFlashMessage({ message, type });
    };

    return (
        <FlashContext.Provider value={{ setFlash }}>
            <div className="flex flex-col min-h-screen relative">
                {/* ヘッダー */}
                <Header />

                {/* フラッシュメッセージ */}
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    onClose={() =>
                        setFlashMessage({ message: null, type: null })
                    }
                />

                {/* ページコンテンツ */}
                <main className="flex-1 pb-24">{children}</main>

                {/* フッター */}
                <Footer className="fixed bottom-0 left-0 w-full z-50" />
            </div>
        </FlashContext.Provider>
    );
}
