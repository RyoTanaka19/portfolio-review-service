// postcssの設定ファイル
// インストールしたプラグインで、使用したいものを記述する
// 基本的にファイル生成時に自動でインストールしたプラグインが列挙される
// 後から追加する場合は手動で記入する必要がある
module.exports = {
    plugins: [require("tailwindcss"), require("autoprefixer")],
};
