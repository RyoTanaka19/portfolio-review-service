import "../css/app.css";
import "./bootstrap";
import "./ziggy";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    // ページタイトルの設定
    title: (title) => `${title} - ${appName}`,

    // ページコンポーネントの解決
    resolve: (name) =>
        resolvePageComponent(
            // Laravel から渡される名前に対応
            `./Pages/${name}.jsx`,
            // すべての Pages 以下の jsx/ts/tsx ファイルを事前に登録
            import.meta.glob("./Pages/**/*.{js,jsx,ts,tsx}", { eager: true })
        ),

    // React 18 の createRoot によるレンダリング
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    // プログレスバー設定
    progress: {
        color: "#4B5563",
    },
});
