import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/js/app.jsx", // メインのアプリケーションエントリーポイント
                "resources/js/Pages/Home.jsx", // 他のページコンポーネントを追加する場合
            ],
            refresh: true,
        }),
        react(),
    ],
});
