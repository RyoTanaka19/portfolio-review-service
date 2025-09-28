// resources/js/Pages/ContactForm.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function ContactForm() {
    return (
        <AppLayout>
            <Head title="お問い合わせ" />

            <div className="flex flex-col items-center px-4 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                    お問い合わせ
                </h1>

                <p className="text-center mb-8 text-base md:text-lg">
                    下記のフォームからお問い合わせください。
                </p>

                <div className="flex justify-center w-full">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfaZ-TBAlJYnTooHnTuYvuV7i7wCDPdK5QGgHtM1u6fPlVAYQ/viewform?embedded=true"
                        width="100%"
                        style={{ maxWidth: "640px", height: "1300px" }}
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        title="お問い合わせフォーム"
                        className="rounded-lg shadow-lg"
                    >
                        読み込んでいます…
                    </iframe>
                </div>
            </div>
        </AppLayout>
    );
}
