import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";

export default function Index({ portfolios }) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Portfolio List</h1>
            {portfolios.map((p) => (
                <div key={p.id} className="border p-2 mb-2">
                    <h2 className="font-bold">{p.title}</h2>
                    <p>{p.description}</p>
                    <a href={p.url} className="text-blue-500" target="_blank">
                        Visit
                    </a>
                </div>
            ))}
        </div>
    );
}
