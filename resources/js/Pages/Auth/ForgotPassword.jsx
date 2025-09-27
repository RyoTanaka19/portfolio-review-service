import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout";
import FlashMessage from "@/Components/FlashMessage";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const { status, flash = {} } = usePage().props;
    const [flashMessage, setFlashMessage] = useState(
        flash.flash || status || ""
    );

    useEffect(() => {
        if (status) setFlashMessage(status);
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <AppLayout>
            <Head title="パスワードをお忘れですか?" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl">
                    {/* フラッシュメッセージ */}
                    {flashMessage && (
                        <FlashMessage
                            message={flashMessage}
                            type="success"
                            onClose={() => setFlashMessage("")}
                        />
                    )}

                    <div className="bg-white shadow-xl rounded-2xl p-12">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
                            パスワードをお忘れですか？
                        </h2>

                        <p className="mb-10 text-gray-700 text-center text-lg leading-relaxed">
                            ご登録のメールアドレスを入力すると、パスワードリセットリンクをお送りします。
                            そのリンクから新しいパスワードを設定できます。
                        </p>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    isFocused
                                    autoComplete="username"
                                    placeholder="メールアドレス"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-sm text-red-600"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* ホームに戻るボタン */}
                                <Link
                                    href={route("home")}
                                    className="w-full sm:w-auto bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow text-center transition-colors duration-200"
                                >
                                    ホーム画面に戻る
                                </Link>

                                {/* パスワードリセット送信ボタン */}
                                <PrimaryButton
                                    disabled={processing}
                                    className="w-full sm:w-auto bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors duration-200"
                                >
                                    パスワードリセットリンクを送信
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
