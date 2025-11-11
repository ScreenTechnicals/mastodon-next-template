'use client';

import { useUserProfileInfo } from '@/hooks/use-user-profile-info.hook';
import { format } from 'date-fns';
import { Calendar, Hash, Link2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
    const { isLoading, data: profile } = useUserProfileInfo();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full animate-pulse mb-6" />
                    <div className="h-5 bg-gray-800 rounded w-40 mx-auto mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-800 rounded w-32 mx-auto animate-pulse" />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-gray-500">
                Failed to load profile
            </div>
        );
    }

    const joinedDate = profile.createdAt
        ? format(new Date(profile.createdAt), 'MMMM d, yyyy')
        : 'Unknown';

    return (
        <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Main Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="h-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative border-b border-gray-800">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative">
                                <Image
                                    src={profile.avatar || '/default-avatar.png'}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-gray-900 shadow-xl object-cover"
                                    priority
                                />
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-10 px-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-1">
                                {profile.displayName || 'User'}
                            </h1>
                            <p className="text-gray-400 text-lg font-mono">@{profile.username}</p>
                        </div>

                        {profile.note && (
                            <div className="mb-8 bg-gray-800/50 border border-gray-800 rounded-xl p-5">
                                <p
                                    className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: profile.note }}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5 text-center hover:bg-gray-800/60 transition">
                                <p className="text-2xl font-bold text-white">
                                    {profile.statusesCount?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Posts</p>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5 text-center hover:bg-gray-800/60 transition">
                                <p className="text-2xl font-bold text-white">
                                    {profile.followersCount?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Followers</p>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-5 text-center hover:bg-gray-800/60 transition">
                                <p className="text-2xl font-bold text-white">
                                    {profile.followingCount?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Following</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-gray-500 border-t border-gray-800 pt-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span>Joined {joinedDate}</span>
                            </div>
                            {profile.url && (
                                <div className="flex items-center gap-3">
                                    <Link2 className="w-4 h-4 text-gray-600" />
                                    <a
                                        href={profile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white underline transition"
                                    >
                                        {profile.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Hash className="w-4 h-4 text-gray-600" />
                                <span className="font-mono text-xs text-gray-600">ID: {profile.id}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="mt-10 w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3.5 rounded-xl border border-gray-700 transition flex items-center justify-center gap-2.5 group"
                        >
                            <LogOut className="w-4.5 h-4.5 group-hover:translate-x-[-2px] transition" />
                            Logout
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-700 text-xs mt-8 font-mono">
                    Mastodon • {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}