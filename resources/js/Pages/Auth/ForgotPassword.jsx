import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, Link } from "@inertiajs/react"; // Link を追加

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="パスワードをお忘れですか?" />

            <div className="mb-4 text-sm text-gray-600">
                パスワードを忘れてしまいましたか？問題ありません。
                メールアドレスを入力していただければ、パスワードリセットリンクをお送りします。
                そのリンクから新しいパスワードを設定できます。
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

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
                    {/* ホーム画面に戻るボタン */}
                    <Link
                        href={route("home")} // Home.jsx に対応するルート名を指定
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
