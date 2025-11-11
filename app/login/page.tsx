'use client';

import { LogIn, UserPlus } from 'lucide-react';
import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-10 text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
                            <span className='text-4xl font-bold'>M</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-3">
                        Welcome to Mastodon
                    </h1>
                    <p className="text-gray-400 mb-10 text-sm">
                        Connect your account to continue
                    </p>

                    <button
                        onClick={() => signIn('mastodon', { callbackUrl: '/profile' })}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-3 group mb-4"
                    >
                        <LogIn className="w-5 h-5 group-hover:translate-x-[-2px] transition" />
                        Sign in with Mastodon
                    </button>

                    <button
                        onClick={() => window.open("https://mastodon.social/auth/sign_up", "_blank")}
                        className="w-full bg-green-900/50 hover:bg-green-900/70 text-green-300 font-medium py-4 rounded-xl border border-green-800/50 transition-all flex items-center justify-center gap-3 group backdrop-blur"
                    >
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition" />
                        Create a new account
                    </button>

                    <p className="text-xs text-gray-600 mt-8 font-mono">
                        Decentralized • Open Source • Ad-Free
                    </p>
                </div>

                <p className="text-center text-gray-700 text-xs mt-8 font-mono">
                    © {new Date().getFullYear()} • Built with Next.js + Tailwind
                </p>
            </div>
        </div>
    );
}