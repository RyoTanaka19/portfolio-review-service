import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
import React from "react";

export default function Register({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [flashMessage, setFlashMessage] = React.useState(status || "");

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AppLayout>
            <Head title="ユーザー登録" />

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
                        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
                            ユーザー登録
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* ユーザー名 */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value={
                                        <>
                                            ユーザー名{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    placeholder="ユーザー名"
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* メールアドレス */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value={
                                        <>
                                            メールアドレス{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="メールアドレス"
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* パスワード */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value={
                                        <>
                                            パスワード{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="パスワード（6文字以上）"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    minLength={6}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* パスワード確認 */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value={
                                        <>
                                            パスワード（確認用）{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    placeholder="パスワード確認（6文字以上）"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    minLength={6}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* 登録ボタン */}
                            <div className="flex items-center justify-between">
                                <Link
                                    href={route("login")}
                                    className="text-sm text-gray-600 underline hover:text-gray-900"
                                >
                                    すでに登録済みの方はこちら
                                </Link>
                                <PrimaryButton
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    disabled={processing}
                                >
                                    登録
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
