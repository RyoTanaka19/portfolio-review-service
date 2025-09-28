import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useRef, useState } from "react";
import FlashMessage from "@/Components/FlashMessage";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [localErrors, setLocalErrors] = useState({});
    const [flashMessage, setFlashMessage] = useState("");
    const [processing, setProcessing] = useState(false);

    // サーバー側バリデーションメッセージを日本語に変換
    const translateError = (field, message) => {
        if (!message) return "";

        if (field === "current_password") {
            if (
                message.includes("正しくありません") ||
                message.includes("incorrect")
            ) {
                return "正しいパスワードではありません";
            }
            return "現在のパスワードは必須です。";
        }

        const map = {
            password: "新しいパスワードは必須です。",
            password_confirmation: "パスワード（確認）は必須です。",
        };

        return map[field] || message;
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        // フロント側バリデーション
        const errors = {};
        if (!formData.current_password.trim()) {
            errors.current_password = "現在のパスワードを入力してください";
        }
        if (!formData.password.trim()) {
            errors.password = "新しいパスワードは必須です";
        }
        if (!formData.password_confirmation.trim()) {
            errors.password_confirmation = "パスワード（確認）は必須です";
        }

        setLocalErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setProcessing(true);

        try {
            const response = await fetch(route("password.update"), {
                method: "PUT", // LaravelのPUTルート
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    // バリデーションエラー
                    setLocalErrors(data.errors);
                    if (data.errors.current_password) {
                        currentPasswordInput.current.focus();
                    } else if (data.errors.password) {
                        passwordInput.current.focus();
                    }
                } else {
                    // その他のエラー
                    alert(
                        data.message || "パスワード更新中にエラーが発生しました"
                    );
                }
                return;
            }

            // 成功時
            setFormData({
                current_password: "",
                password: "",
                password_confirmation: "",
            });
            setLocalErrors({});
            setFlashMessage(data.message || "パスワードを更新しました");
        } catch (error) {
            console.error(error);
            alert("通信中にエラーが発生しました");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section className={className}>
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

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
                        value={formData.current_password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                current_password: e.target.value,
                            })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError
                        message={localErrors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="新しいパスワード" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={localErrors.password}
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
                        value={formData.password_confirmation}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password_confirmation: e.target.value,
                            })
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={localErrors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                    >
                        保存
                    </PrimaryButton>
                    {flashMessage && (
                        <p className="text-sm text-gray-600">{flashMessage}</p>
                    )}
                </div>
            </form>
        </section>
    );
}
