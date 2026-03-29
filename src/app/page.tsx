"use client";

import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");

    const upload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.url) {
            setUrl(window.location.origin + data.url);
        } else {
            alert("Upload failed");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
            <h1 className="text-3xl font-bold">MP3 Share</h1>

            <input
                type="file"
                accept=".mp3"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
                onClick={upload}
                className="px-6 py-2 bg-purple-600 rounded-xl hover:bg-purple-700"
            >
                Upload
            </button>

            {url && (
                <div className="text-center">
                    <p>Dein Link:</p>
                    <a href={url} className="text-purple-400 underline">
                        {url}
                    </a>

                    <audio controls className="mt-4">
                        <source src={url} type="audio/mpeg" />
                    </audio>
                </div>
            )}
        </main>
    );
}