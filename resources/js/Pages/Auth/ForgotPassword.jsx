import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import FlashMessage from "@/Components/FlashMessage";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    // Inertia の props.status を取得
    const { status } = usePage().props;
    const [flashMessage, setFlashMessage] = useState(status || null);

    // props.status が更新されたら flashMessage も更新
    useEffect(() => {
        if (status) {
            setFlashMessage(status);
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="パスワードをお忘れですか?" />

            {flashMessage && (
                <FlashMessage
                    message={flashMessage}
                    type="success"
                    onClose={() => setFlashMessage(null)}
                />
            )}

            <div className="mb-4 text-sm text-gray-600">
                パスワードを忘れてしまいましたか？問題ありません。
                メールアドレスを入力していただければ、パスワードリセットリンクをお送りします。
                そのリンクから新しいパスワードを設定できます。
            </div>

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-between">
                    <Link
                        href={route("home")}
                        className="text-sm text-gray-500 underline hover:text-gray-700"
                    >
                        ホーム画面に戻る
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        パスワードリセットリンクを送信
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
