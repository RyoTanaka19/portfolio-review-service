import React from "react";
import { Head, InertiaLink } from "@inertiajs/inertia-react";
import AppLayout from "@/Layouts/AppLayout";

export default function HowTo({ title = "使い方" }) {
    return (
        <AppLayout>
            <Head title={title} />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>

                <p className="mb-6">
                    このページでは、ポートフォリオレビューサービスの基本的な使い方を紹介します。
                </p>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        1. サインアップ
                    </h2>
                    <p>
                        アカウントを作成して、プロフィールを設定してください。
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        2. ポートフォリオの作成
                    </h2>
                    <p>
                        「ポートフォリオ作成」画面から作品情報や説明、タグを追加します。
                    </p>
                    {/* Ziggy がある場合は route('portfolios.create') を利用、なければパス直指定 */}
                    <InertiaLink
                        href="/portfolio/create"
                        className="inline-block mt-3 underline"
                    >
                        ポートフォリオを作成する
                    </InertiaLink>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        3. レビューをもらう / レビューを書く
                    </h2>
                    <p>
                        他ユーザーのポートフォリオにレビューを投稿したり、自分のポートフォリオに対するレビューを確認できます。
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        4. 検索・タグ
                    </h2>
                    <p>
                        ヘッダーの検索フィールドやタグクリックで絞り込みができます。タグをクリックするとそのタグのついた投稿だけ表示されます。
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        5. 問い合わせ
                    </h2>
                    <p>
                        不具合や要望は{" "}
                        <InertiaLink
                            href={route ? route("contact") : "/contact"}
                            className="underline"
                        >
                            お問い合わせ
                        </InertiaLink>{" "}
                        から送ってください。
                    </p>
                </section>

                <p className="text-sm text-gray-500 mt-8">
                    何か分かりにくい点があれば、ここにスクリーンショットや GIF
                    を追加すると親切です。
                </p>
            </div>
        </AppLayout>
    );
}
