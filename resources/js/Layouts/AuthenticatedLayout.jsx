// resources/js/Layouts/AuthenticatedLayout.jsx

import React from "react";
import AppLayout from "./AppLayout"; // 例: AppLayoutをラップする場合
import { Head } from "@inertiajs/react";

export default function AuthenticatedLayout({ children, title }) {
    return (
        <AppLayout>
            {title && <Head title={title} />}
            <div className="container mx-auto px-4">{children}</div>
        </AppLayout>
    );
}
