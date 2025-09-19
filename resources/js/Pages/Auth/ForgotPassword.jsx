import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout"; // GuestLayout → AppLayout
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
                <div className="w-full max-w-md space-y-8">
                    {/* フラッシュメッセージ */}
                    {flashMessage && (
                        <FlashMessage
                            message={flashMessage}
                            type="success"
                            onClose={() => setFlashMessage("")}
                        />
                    )}

                    <div className="bg-white shadow-md rounded-lg px-8 py-10">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                            パスワードをお忘れですか?
                        </h2>

                        <p className="mb-6 text-sm text-gray-600 text-center">
                            パスワードを忘れてしまいましたか？問題ありません。
                            メールアドレスを入力していただければ、パスワードリセットリンクをお送りします。
                            そのリンクから新しいパスワードを設定できます。
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    isFocused
                                    autoComplete="username"
                                    placeholder="メールアドレス"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href={route("home")}
                                    className="text-sm text-gray-500 underline hover:text-gray-700"
                                >
                                    ホーム画面に戻る
                                </Link>
                                <PrimaryButton
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
