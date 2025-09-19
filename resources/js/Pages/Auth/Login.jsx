import React from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const { flash = {} } = usePage().props;
    const [flashMessage, setFlashMessage] = React.useState(
        flash.flash || status || ""
    );

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AppLayout>
            <Head title="ログイン" />

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
                            ログイン
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* メール */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="メールアドレス"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-1"
                                />
                            </div>

                            {/* パスワード */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="パスワード"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-1"
                                />
                            </div>

                            {/* ログイン状態保持 */}
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    ログイン状態を保持する
                                </span>
                            </div>

                            {/* パスワードリセット & ログインボタン */}
                            <div className="flex items-center justify-between">
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm text-gray-600 underline hover:text-gray-900"
                                    >
                                        パスワードをお忘れですか？
                                    </Link>
                                )}
                                <PrimaryButton
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    ログイン
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Googleログイン */}
                        <div className="mt-6">
                            <a
                                href="/auth/google"
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                {/* Google「G」ロゴ */}
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 533.5 544.3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M533.5 278.4c0-18.7-1.5-37-4.3-54.6H272v103.5h146.9c-6.3 34.2-25.3 63.3-53.9 82.7v68.8h87c51.2-47.1 81.5-116.7 81.5-200.4z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M272 544.3c72.7 0 133.7-24 178.2-65.4l-87-68.8c-24.2 16.3-55.3 25.9-91.2 25.9-70.2 0-129.7-47.4-151-111.2H33.6v69.7C77.9 485 169 544.3 272 544.3z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M120.9 331.9c-5.5-16.3-8.7-33.7-8.7-51.9s3.2-35.6 8.7-51.9v-69.7H33.6c-18.8 36.6-29.6 77.9-29.6 121.6s10.8 85 29.6 121.6l87.3-69.6z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M272 107.7c37.4 0 70.8 12.9 97.3 38.2l72.9-72.9C405.7 24.2 344.7 0 272 0 169 0 77.9 59.3 33.6 147.8l87.3 69.7c21.3-63.8 80.8-111.2 151-111.2z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="font-medium">
                                    Googleでログイン
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
