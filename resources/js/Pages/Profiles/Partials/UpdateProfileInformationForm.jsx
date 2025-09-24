import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import FlashMessage from "@/Components/FlashMessage";

export default function UpdateProfileInformationForm() {
    const { user, allTags = [] } = usePage().props;

    const { data, setData, errors, processing } = useForm({
        _method: "patch",
        name: user.name,
        email: user.email,
        profile_image: null,
        delete_profile_image: false,
        tags: user.tags?.map((tag) => tag.id) || [],
    });

    const [preview, setPreview] = useState(user?.profile_image_url || null);
    const [flashMessage, setFlashMessage] = useState("");

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:"))
                URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setData("profile_image", file);
        setData("delete_profile_image", false);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const toggleTag = (tagId) => {
        setData(
            "tags",
            data.tags.includes(tagId)
                ? data.tags.filter((id) => id !== tagId)
                : [...data.tags, tagId]
        );
    };

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("_method", "patch");
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.profile_image)
            formData.append("profile_image", data.profile_image);
        formData.append(
            "delete_profile_image",
            data.delete_profile_image ? 1 : 0
        );
        data.tags.forEach((id) => formData.append("tags[]", id));

        try {
            const response = await fetch(route("profile.update"), {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                const updatedUser = result.user;
                setData({
                    _method: "patch",
                    name: updatedUser.name,
                    email: updatedUser.email,
                    profile_image: null,
                    delete_profile_image: false,
                    tags: updatedUser.tags.map((tag) => tag.id),
                });
                setPreview(updatedUser.profile_image_url || null);
                setFlashMessage(result.message);
            } else {
                setFlashMessage(result.message || "更新に失敗しました");
            }
        } catch (err) {
            setFlashMessage("サーバーエラーが発生しました");
        }
    };

    return (
        <form
            onSubmit={submit}
            encType="multipart/form-data"
            className="space-y-6"
        >
            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage("")}
                />
            )}

            <div>
                <InputLabel htmlFor="name" value="名前" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="メールアドレス" />
                <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="profile_image" value="プロフィール画像" />
                {preview ? (
                    <div className="mt-2 w-24 h-24 rounded-full overflow-hidden">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
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
            </div>

            <div>
                <InputLabel value="タグ" />
                <div className="mt-2 flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1 rounded-full border text-sm ${
                                data.tags.includes(tag.id)
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            </div>

            <PrimaryButton disabled={processing}>保存</PrimaryButton>
        </form>
    );
}
