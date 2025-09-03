// resources/js/Pages/ContactForm.jsx
import React from "react";
import { Head } from "@inertiajs/react";

export default function ContactForm() {
    return (
        <>
            <Head title="お問い合わせ" />
            <div className="max-w-screen-lg mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                    お問い合わせ
                </h1>

                <p className="text-center mb-8 text-base md:text-lg">
                    下記のフォームからお問い合わせください。
                </p>

                <div className="w-full flex justify-center">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfaZ-TBAlJYnTooHnTuYvuV7i7wCDPdK5QGgHtM1u6fPlVAYQ/viewform?embedded=true"
                        width="100%"
                        height="1140"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        className="max-w-3xl rounded-lg shadow-lg"
                        title="Googleフォーム"
                    >
                        読み込んでいます…
                    </iframe>
                </div>
            </div>
        </>
    );
}
