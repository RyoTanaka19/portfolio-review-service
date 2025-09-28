import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout"; // GuestLayout → AppLayout
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AppLayout>
            <Head title="パスワード再設定" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="bg-white shadow-md rounded-lg px-8 py-10">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                            パスワード再設定
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* メールアドレス（表示のみ） */}
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
                                    className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                                    autoComplete="username"
                                    readOnly
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* 新しいパスワード */}
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
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    isFocused={true}
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
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
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

                            {/* ボタン */}
                            <div className="flex items-center justify-between">
                                <PrimaryButton
                                    className="bg-blue-700 hover:bg-blue-800 text-white"
                                    disabled={processing}
                                >
                                    パスワードを再設定
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
