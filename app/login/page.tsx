'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {

    return (
        <main className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Login with Mastodon</h1>
            <button
                onClick={() => signIn('mastodon')}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Sign In
            </button>
        </main>
    );
}
