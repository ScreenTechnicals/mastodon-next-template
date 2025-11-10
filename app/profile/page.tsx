'use client';

import { useUserProfileInfo } from '@/hooks/use-user-profile-info.hook';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
    const { isLoading, data: profile } = useUserProfileInfo()

    if (isLoading) return <p className="p-4 text-center">Loading profile...</p>;


    return (
        <main className="p-6 max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-3">@{profile?.username}</h1>
            <Image
                src={profile?.avatar ?? ''}
                alt="avatar"
                width={120}
                height={120}
                className="mx-auto rounded-full w-24 h-24 mb-4"
            />
            <p className="font-semibold text-gray-700">{profile?.displayName}</p>
            <p
                className="mt-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: profile?.note ?? '' }}
            />
            <div className="mt-4 text-sm text-gray-500">
                <p>ID: {profile?.id}</p>
                <p>Followers: {profile?.followersCount}</p>
                <p>Following: {profile?.followingCount}</p>
            </div>
            <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </main>
    );
}
