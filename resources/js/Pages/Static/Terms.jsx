// resources/js/Pages/Terms.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Terms() {
    return (
        <AppLayout>
            <Head title="利用規約" />
            <div className="max-w-screen-lg mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 my-10 leading-relaxed">
                    {/* タイトル */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        利用規約
                    </h1>

                    {/* 本規約説明 */}
                    <p className="text-base md:text-lg mb-10">
                        この利用規約(以下、「本規約」といいます。)は、本サービス(本サイトを含むものとし、以下、特に両者を区別しません。)の利用条件を定めるものです。
                        本規約は、本サービスを利用するすべてのユーザーに適用されます。
                    </p>

                    {/* セクション群 */}
                    <div className="space-y-10 prose prose-sm md:prose-base max-w-none">
                        {/* 本規約への同意 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                本規約への同意
                            </h2>
                            <p>
                                ユーザーは、本サービスを利用することによって、本規約に有効かつ取り消し不能な同意をしたものとみなされます。
                                本規約に同意しないユーザーは、本サービスをご利用いただけません。
                            </p>
                        </section>

                        {/* 利用登録 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                利用登録
                            </h2>
                            <p>
                                本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、
                                当社がこれを承認することによって、本サービスの利用登録をすることができます。
                            </p>
                        </section>

                        {/* 登録拒否 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                登録拒否
                            </h2>
                            <p>
                                当社は、以下のいずれかの事由があると判断した場合、利用登録の申請を承認しないことがあります。
                                当社は登録拒否の理由について一切の開示義務を負いません。
                            </p>
                            <ul>
                                <li>虚偽の事項を届け出た場合</li>
                                <li>
                                    本規約に違反したことがある者からの申請である場合
                                </li>
                                <li>
                                    その他、当社が利用登録を相当でないと判断した場合
                                </li>
                            </ul>
                        </section>

                        {/* 未成年による利用 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                未成年による利用
                            </h2>
                            <p>
                                ユーザーが未成年である場合には、法定代理人の同意を得た上で、本サービスを利用してください。
                                必要となるデバイスについても、必ず法定代理人の同意を得た上でご使用下さい。
                                <br />
                                法定代理人の同意を得ずに利用を開始したユーザーが成年に達した場合、
                                未成年者であった間の利用行為を追認したものとみなします。
                            </p>
                        </section>

                        {/* ログイン情報の管理 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                ログイン情報の管理
                            </h2>
                            <p>
                                ユーザーは、自己の責任において、本サービスのログイン情報を適切に管理するものとします。
                                いかなる場合にも、ログイン情報を第三者に譲渡または貸与し、共用することはできません。
                                当社は、ログイン情報が第三者によって使用されたことによって生じた損害につき、
                                当社に故意又は重大な過失がある場合を除き、一切の責任を負いません。
                            </p>
                        </section>

                        {/* コンテンツのご利用 */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-3 bg-blue-50 rounded">
                                コンテンツのご利用
                            </h2>
                            <p>
                                当社は、ユーザーに対し、本サービスが提供する文章、画像、動画、音声、音楽、ソフトウェア、
                                プログラム、コードその他のコンテンツについて、本サービスの利用範囲内における私的な利用を許諾します。
                                <br />
                                有償コンテンツについては、利用料金の支払完了後に同様の利用を許諾します。
                                これは譲渡・再許諾できない非独占的な利用権であり、範囲を超えた利用は禁止されます。
                                <br />
                                理由の如何を問わず、ユーザーが利用する権利を失った場合、
                                本サービスの一切のコンテンツの利用ができなくなることを予め承諾するものとします。
                            </p>
                        </section>
                    </div>

                    {/* 最終の制定日 */}
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
