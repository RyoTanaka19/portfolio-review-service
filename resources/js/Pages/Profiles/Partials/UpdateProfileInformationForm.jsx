import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { user, allTags = [] } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: "patch",
            name: user.name,
            email: user.email,
            tags: user.tags?.map((tag) => tag.id) || [],
        });

    const [localErrors, setLocalErrors] = useState({}); // フロント側バリデーション用
    const [flashMessage, setFlashMessage] = useState(""); // フラッシュメッセージ用

    const toggleTag = (tagId) => {
        if (data.tags.includes(tagId)) {
            setData(
                "tags",
                data.tags.filter((id) => id !== tagId)
            );
        } else {
            setData("tags", [...data.tags, tagId]);
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        // フロント側バリデーション
        const validationErrors = {};
        if (!data.name.trim()) validationErrors.name = "名前を入力してください";
        if (!data.email.trim())
            validationErrors.email = "メールアドレスを入力してください";
        setLocalErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return; // エラーがあれば送信中止

        try {
            const formData = new FormData();
            formData.append("_method", "patch");
            formData.append("name", data.name);
            formData.append("email", data.email);

            // tags を tags[] として送信
            data.tags.forEach((id) => formData.append("tags[]", id));

            // Axios 送信（Content-Type は自動設定）
            const response = await axios.post(
                route("profile.update"),
                formData
            );

            if (response.data.success) {
                const updatedUser = response.data.user;

                // Header に即時反映させる
                window.dispatchEvent(
                    new CustomEvent("user-updated", { detail: updatedUser })
                );

                // フォームに最新情報を反映
                setData({
                    _method: "patch",
                    name: updatedUser.name,
                    email: updatedUser.email,
                    tags: updatedUser.tags.map((tag) => tag.id),
                });

                setFlashMessage(response.data.message);
            } else {
                setFlashMessage(response.data.message || "更新に失敗しました");
            }
        } catch (error) {
            console.error(error);

            // Laravel のバリデーションエラーを取得
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors || {};
                setLocalErrors(serverErrors);
                setFlashMessage("入力内容にエラーがあります");
            } else {
                setFlashMessage("サーバーエラーが発生しました");
            }
        }
    };

    return (
        <section className={className}>
            {/* フラッシュメッセージ */}
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    プロフィール情報
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    アカウントのプロフィール情報、メールアドレス、タグを更新できます。
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* 名前 */}
                <div>
                    <InputLabel htmlFor="name" value="名前" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        autoComplete="name"
                    />
                    <InputError
                        className="mt-2"
                        message={localErrors.name || errors.name}
                    />
                </div>

                {/* メール */}
                <div>
                    <InputLabel htmlFor="email" value="メールアドレス" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                    />
                    <InputError
                        className="mt-2"
                        message={localErrors.email || errors.email}
                    />
                </div>

                {/* タグ選択 */}
                <div>
                    <InputLabel htmlFor="tags" value="タグ" />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTag(tag.id)}
                                className={`px-3 py-1 rounded-full border ${
                                    data.tags.includes(tag.id)
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-gray-700 border-gray-300"
                                } text-sm`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                    <InputError className="mt-2" message={errors.tags} />
                </div>

                {/* メール確認再送 */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            メールアドレスが未確認です。
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                こちらをクリックして確認メールを再送信してください
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                確認メールを再送信しました。
                            </div>
                        )}
                    </div>
                )}

                {/* 保存 */}
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
