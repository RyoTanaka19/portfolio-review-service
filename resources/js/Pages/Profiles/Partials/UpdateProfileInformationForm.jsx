import React, { useState, useEffect } from "react";
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
            profile_image: null,
            delete_profile_image: false,
            tags: user.tags?.map((tag) => tag.id) || [],
        });

    // public/image/profile_images を反映した preview
    const [preview, setPreview] = useState(
        user?.profile_image
            ? `/image/profile_images/${user.profile_image}`
            : null
    );
    const [localErrors, setLocalErrors] = useState({});
    const [flashMessage, setFlashMessage] = useState("");

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setData("profile_image", file);
        setData("delete_profile_image", false);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

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

        const validationErrors = {};
        if (!data.name.trim()) validationErrors.name = "名前を入力してください";
        if (!data.email.trim())
            validationErrors.email = "メールアドレスを入力してください";
        setLocalErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const formData = new FormData();
            formData.append("_method", "patch");
            formData.append("name", data.name);
            formData.append("email", data.email);

            if (data.profile_image) {
                formData.append("profile_image", data.profile_image);
            }

            formData.append(
                "delete_profile_image",
                data.delete_profile_image ? 1 : 0
            );

            data.tags.forEach((id) => formData.append("tags[]", id));

            const response = await axios.post(
                route("profile.update"),
                formData
            );

            if (response.data.success) {
                const updatedUser = response.data.user;

                window.dispatchEvent(
                    new CustomEvent("user-updated", { detail: updatedUser })
                );

                setData({
                    _method: "patch",
                    name: updatedUser.name,
                    email: updatedUser.email,
                    profile_image: null,
                    delete_profile_image: false,
                    tags: updatedUser.tags.map((tag) => tag.id),
                });

                // public/image/profile_images に保存された画像URLを反映
                setPreview(
                    updatedUser.profile_image
                        ? `/image/profile_images/${updatedUser.profile_image}`
                        : null
                );
                setFlashMessage(response.data.message);
            } else {
                setFlashMessage(response.data.message || "更新に失敗しました");
            }
        } catch (error) {
            console.error(error);
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
                    アカウントのプロフィール情報、メールアドレス、プロフィール画像、タグを更新できます。
                </p>
            </header>

            <form
                onSubmit={submit}
                encType="multipart/form-data"
                className="mt-6 space-y-6"
            >
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

                {/* プロフィール画像 */}
                <div>
                    <InputLabel
                        htmlFor="profile_image"
                        value="プロフィール画像"
                    />
                    {preview ? (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="preview"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-gray-500">
                            画像がありません
                        </div>
                    )}
                    <input
                        type="file"
                        id="profile_image"
                        accept="image/*"
                        onChange={onFileChange}
                        className="mt-2"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.profile_image}
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
