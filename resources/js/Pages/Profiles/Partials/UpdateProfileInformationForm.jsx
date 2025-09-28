import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
import axios from "axios";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { user, allTags = [], userProfileImageUrl } = usePage().props;

    const { data, setData, errors, processing } = useForm({
        _method: "patch",
        name: user.name,
        email: user.email,
        tags: user.tags?.map((tag) => tag.id) || [],
        profile_image: null,
        git_url: user.git_url || "",
    });

    const [previewImage, setPreviewImage] = useState(
        userProfileImageUrl || null
    );
    const [flashMessage, setFlashMessage] = useState(null); // { message: "", type: "success" | "error" }
    const [localErrors, setLocalErrors] = useState({});

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!data.name.trim()) validationErrors.name = "名前を入力してください";
        if (!data.email.trim())
            validationErrors.email = "メールアドレスを入力してください";
        setLocalErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setFlashMessage({
                message: "入力内容にエラーがあります",
                type: "error",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("_method", "patch");
            formData.append("name", data.name);
            formData.append("email", data.email);
            data.tags.forEach((id) => formData.append("tags[]", id));
            formData.append("git_url", data.git_url);
            if (data.profile_image)
                formData.append("profile_image", data.profile_image);

            const response = await axios.post(
                route("profile.update"),
                formData
            );

            if (response.data.success) {
                const updatedUser = response.data.user;

                if (response.data.profileImageUrl)
                    setPreviewImage(response.data.profileImageUrl);

                setData({
                    _method: "patch",
                    name: updatedUser.name,
                    email: updatedUser.email,
                    tags: updatedUser.tags.map((tag) => tag.id),
                    profile_image: null,
                });

                window.dispatchEvent(
                    new CustomEvent("user-updated", { detail: updatedUser })
                );

                setFlashMessage({
                    message:
                        response.data.message ||
                        "プロフィール情報を更新しました",
                    type: "success",
                });
            } else {
                setFlashMessage({
                    message: response.data.message || "更新に失敗しました",
                    type: "error",
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors || {};
                setLocalErrors(serverErrors);
                setFlashMessage({
                    message: "入力内容にエラーがあります",
                    type: "error",
                });
            } else {
                setFlashMessage({
                    message: "サーバーエラーが発生しました",
                    type: "error",
                });
            }
        }
    };

    return (
        <section className={className}>
            {flashMessage && (
                <FlashMessage
                    message={flashMessage.message}
                    type={flashMessage.type}
                    onClose={() => setFlashMessage(null)}
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

                {/* GitHub URL */}
                <div>
                    <InputLabel htmlFor="git_url" value="GitHub URL" />
                    <TextInput
                        id="git_url"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.git_url}
                        onChange={(e) => setData("git_url", e.target.value)}
                        placeholder="https://github.com/username"
                    />
                    <InputError
                        className="mt-2"
                        message={localErrors.git_url || errors.git_url}
                    />
                </div>

                {/* プロフィール画像 */}
                <div>
                    <InputLabel
                        htmlFor="profile_image"
                        value="プロフィール画像"
                    />
                    <div className="mt-2">
                        <input
                            id="profile_image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-2"
                        />
                    </div>
                    {previewImage && (
                        <div className="mt-2">
                            <img
                                src={previewImage}
                                alt="プロフィールプレビュー"
                                className="h-24 w-24 rounded-full object-cover border"
                            />
                        </div>
                    )}
                    <InputError
                        className="mt-2"
                        message={
                            errors.profile_image || localErrors.profile_image
                        }
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

                {/* 保存 */}
                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        保存
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
