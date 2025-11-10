// 'use client';
// import { useState } from 'react';

// export default function Login() {
//     const [loading, setLoading] = useState(false);

//     const handleLogin = async () => {
//         setLoading(true);
//         const res = await fetch('/api/masto/login');
//         const { url } = await res.json();
//         window.location.href = url;
//     };

//     return (
//         <main className="p-6 text-center">
//             <h1 className="text-2xl font-bold mb-4">Login with Mastodon</h1>
//             <button
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//                 {loading ? 'Redirecting...' : 'Login with Mastodon'}
//             </button>
//         </main>
//     );
// }


'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
    const { data: session } = useSession();
    if (session) {
        console.log("session", session);


        return (

            <main className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome @{session.user.username}</h1>
                <img src={session.user.image} alt="avatar" className="mx-auto rounded-full w-24 h-24 mb-4" />
                <button
                    onClick={() => signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </main>

        );
    }

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
