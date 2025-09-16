// resources/js/Pages/Privacy.jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Privacy() {
    return (
        <AppLayout>
            <Head title="プライバシーポリシー" />
            <div className="max-w-screen-lg mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 my-10 leading-relaxed">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        プライバシーポリシー
                    </h1>

                    <p className="text-base md:text-lg mb-10">
                        ポートフォリオレビューサービス（以下、「当社」といいます。）は、本ウェブサイト上で提供するサービス
                        （以下,「本サービス」といいます。）におけるユーザーの個人情報の取扱いについて、
                        以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
                    </p>

                    <div className="space-y-10 prose prose-sm md:prose-base max-w-none">
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                お客様から取得する情報
                            </h2>
                            <p>当社は、お客様から以下の情報を取得します。</p>
                            <ul>
                                <li>氏名(ニックネームやペンネームも含む)</li>
                                <li>メールアドレス</li>
                                <li>写真や動画</li>
                                <li>
                                    Cookie(クッキー)を用いて生成された識別情報
                                </li>
                                <li>
                                    当社ウェブサイトの滞在時間、入力履歴、購買履歴等の行動履歴
                                </li>
                                <li>
                                    当社アプリの起動時間、入力履歴、購買履歴等の利用履歴
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                お客様の情報を利用する目的
                            </h2>
                            <p>
                                当社は、お客様から取得した情報を、以下の目的のために利用します。
                            </p>
                            <ul>
                                <li>
                                    当社サービスに関する登録の受付、本人確認、認証のため
                                </li>
                                <li>利用履歴の管理のため</li>
                                <li>
                                    行動履歴を分析し、サービス改善に役立てるため
                                </li>
                                <li>
                                    提携する事業者・サービスの案内送付のため
                                </li>
                                <li>お問い合わせ対応のため</li>
                                <li>規約や法令違反行為への対応のため</li>
                                <li>
                                    サービスの変更・提供中止・終了・契約解除の連絡のため
                                </li>
                                <li>規約の変更通知のため</li>
                                <li>
                                    その他、サービスの提供・維持・改善のため
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                安全管理のために講じた措置
                            </h2>
                            <p>
                                お客様から取得した情報の安全管理措置につきましては、
                                末尾記載のお問い合わせ先にご連絡をいただきましたら、
                                法令の定めに従い個別にご回答させていただきます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                第三者提供
                            </h2>
                            <p>
                                当社は、個人データをお客様の同意なく第三者へ提供しません。
                                但し、以下の場合は除きます。
                            </p>
                            <ul>
                                <li>個人データの取扱いを外部委託する場合</li>
                                <li>当社やサービスが買収された場合</li>
                                <li>
                                    事業パートナーと共同利用する場合（詳細は別途公表）
                                </li>
                                <li>法律により合法的に認められる場合</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                アクセス解析ツール
                            </h2>
                            <p>
                                当社は「Googleアナリティクス」を利用しています。Cookieを使用し、匿名のトラフィックデータを収集します。
                                個人を特定するものではなく、Cookieを無効化することで収集を拒否できます。
                            </p>
                            <p>
                                詳しくは{" "}
                                <a
                                    href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Googleアナリティクス利用規約
                                </a>{" "}
                                をご覧ください。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                プライバシーポリシーの変更
                            </h2>
                            <p>
                                当社は、必要に応じて本プライバシーポリシーを変更します。
                                変更後の内容と施行時期については適切な方法で周知または通知します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                お問い合わせ
                            </h2>
                            <p>
                                開示・訂正・利用停止・削除をご希望の場合は、{" "}
                                <Link
                                    href={route ? route("contact") : "/contact"} // Ziggyがある場合はroute("contact")
                                    className="text-blue-600 hover:underline"
                                >
                                    お問い合わせフォーム
                                </Link>
                                よりご連絡ください。
                            </p>
                        </section>
                    </div>

                    <div className="flex justify-end mt-14">
                        <p className="text-sm text-gray-500">
                            2025年9月3日 制定
                        </p>
                    </div>
                </div>
                <div className="h-20"></div>
            </div>
        </AppLayout>
    );
}
