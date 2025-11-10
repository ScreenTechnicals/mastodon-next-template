'use client';

import { useUserProfileInfo } from '@/hooks/use-user-profile-info.hook';
import Image from 'next/image';

export default function ProfilePage() {
    const { isLoading, username, avatar, displayName, id, followersCount, followingCount, note } = useUserProfileInfo()

    if (isLoading) return <p className="p-4 text-center">Loading profile...</p>;


    return (
        <main className="p-6 max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-3">@{username}</h1>
            <Image
                src={avatar ?? ''}
                alt="avatar"
                width={120}
                height={120}
                className="mx-auto rounded-full w-24 h-24 mb-4"
            />
            <p className="font-semibold text-gray-700">{displayName}</p>
            <p
                className="mt-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: note ?? '' }}
            />
            <div className="mt-4 text-sm text-gray-500">
                <p>ID: {id}</p>
                <p>Followers: {followersCount}</p>
                <p>Following: {followingCount}</p>
            </div>
        </main>
    );
}
