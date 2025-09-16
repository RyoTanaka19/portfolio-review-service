import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [localErrors, setLocalErrors] = useState({}); // フロント側バリデーション用

    // サーバー側バリデーションメッセージを日本語に変換
    const translateError = (field, message) => {
        if (!message) return "";

        // 現在のパスワードエラーを日本語化
        if (field === "current_password") {
            if (
                message.includes("The password is incorrect") ||
                message.includes("正しくありません")
            ) {
                return "正しいパスワードでありません";
            }
            return "現在のパスワードは必須です。";
        }

        const map = {
            password: "新しいパスワードは必須です。",
            password_confirmation: "パスワード（確認）は必須です。",
        };

        return map[field] || message;
    };

    const updatePassword = (e) => {
        e.preventDefault();

        // フロント側バリデーション
        const errors = {};
        if (!data.current_password.trim()) {
            errors.current_password = "現在のパスワードを入力してください";
        }
        if (!data.password.trim()) {
            errors.password = "新しいパスワードは必須です";
        }
        if (!data.password_confirmation.trim()) {
            errors.password_confirmation = "パスワード（確認）は必須です";
        }
        setLocalErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // サーバー送信
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    パスワードの更新
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    安全にアカウントを保護するため、長くランダムなパスワードを使用してください。
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="現在のパスワード"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={
                            localErrors.current_password ||
                            translateError(
                                "current_password",
                                errors.current_password
                            )
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="新しいパスワード" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={
                            localErrors.password ||
                            translateError("password", errors.password)
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="パスワード（確認）"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={
                            localErrors.password_confirmation ||
                            translateError(
                                "password_confirmation",
                                errors.password_confirmation
                            )
                        }
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>保存</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            保存されました。
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
