"use client";

import { useBookmarkStatus } from "@/hooks/mutations/use-bookmark-status.hook";
import { useFavouriteStatus } from "@/hooks/mutations/use-favourite-status.hook";
import { useAddMutedWord } from "@/hooks/mutations/use-mute-actions.hook";
import { usePostStatus } from "@/hooks/mutations/use-post-status.hook";
import { useReblogStatus } from "@/hooks/mutations/use-reblog-status.hook";
import { useHomeTimeline } from "@/hooks/use-home-timeline.hook";
import { useMutedConversations } from "@/hooks/use-muted-conversations.hook";
import { useMutedDomains } from "@/hooks/use-muted-domains.hook";
import { useMutedUsers } from "@/hooks/use-muted-users.hook";
import { useMutedWords } from "@/hooks/use-muted-words.hook";
import { useNotifications } from "@/hooks/use-notifications.hook";
import { usePrivateMentions } from "@/hooks/use-private-mentions.hook";
import { usePublicTimeline } from "@/hooks/use-public-timeline.hook";
import { useStreamingTimeline } from "@/hooks/use-streaming-timeline.hook";
import { useTrendingLinks } from "@/hooks/use-trending-links.hook";
import { useTrendingPosts } from "@/hooks/use-trending-posts.hook";
import { useTrendingTags } from "@/hooks/use-trending-tags.hook";
import { useUserPosts } from "@/hooks/use-user-posts.hook";
import { useUserProfileInfo } from "@/hooks/use-user-profile-info.hook";
import { useState } from "react";

export default function TestHooksPage() {
    const [output, setOutput] = useState<any>(null);
    const [statusText, setStatusText] = useState("");
    const [tag, setTag] = useState("nextjs");

    // 🔐 Core hooks
    const { data: userProfileData } = useUserProfileInfo();;

    // 📬 Fetch hooks
    const { data: userPosts } = useUserPosts();
    const { data: homeFeed } = useHomeTimeline();
    const { data: publicFeed } = usePublicTimeline();
    const { data: notifications } = useNotifications();
    const { data: trendingPosts } = useTrendingPosts();
    const { data: trendingTags } = useTrendingTags();
    const { data: trendingLinks } = useTrendingLinks();
    const { data: mutedUsers } = useMutedUsers();
    const { data: mutedWords } = useMutedWords();
    const { data: mutedDomains } = useMutedDomains();
    const { data: mutedConvos } = useMutedConversations();
    const { data: mentions } = usePrivateMentions();

    // ⚡ Mutations
    const { mutate: postStatus } = usePostStatus();
    const { mutate: favourite } = useFavouriteStatus();
    const { mutate: reblog } = useReblogStatus();
    const { mutate: bookmark } = useBookmarkStatus();
    const { mutate: addMutedWord } = useAddMutedWord();
    const { events } = useStreamingTimeline("public");

    return (
        <main className="p-6 max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold mb-6">🧩 Mastodon Hooks Test Suite</h1>

            {/* --- USER INFO --- */}
            <section className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3">👤 User Profile</h2>
                {userProfileData?.username ? (
                    <div className="flex items-center gap-4">
                        <img src={userProfileData?.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="text-lg font-medium">@{userProfileData?.acct}</p>
                            <p className="text-sm text-gray-400">Signed in as {userProfileData?.username}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">Loading profile...</p>
                )}
            </section>

            {/* --- POSTING --- */}
            <section className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3">✏️ Create Post</h2>
                <textarea
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="Type something..."
                    className="w-full bg-gray-800 text-gray-100 p-3 rounded-lg mb-3"
                />
                <button
                    onClick={() => postStatus({
                        status: statusText
                    })}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                    Post Status
                </button>
            </section>

            {/* --- TIMELINES --- */}
            <section className="grid md:grid-cols-2 gap-5">
                <div className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-semibold mb-3">🏠 Home Timeline</h2>
                    {homeFeed?.slice(0, 3).map((p) => (
                        <p key={p.id} className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: p.content }} />
                    )) || <p className="text-gray-400">Loading...</p>}
                </div>

                <div className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-semibold mb-3">🌍 Public Timeline</h2>
                    {publicFeed?.slice(0, 3).map((p) => (
                        <p key={p.id} className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: p.content }} />
                    )) || <p className="text-gray-400">Loading...</p>}
                </div>
            </section>

            {/* --- TRENDING --- */}
            <section className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3">🔥 Trending</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="font-medium mb-2">Posts</h3>
                        {trendingPosts?.slice(0, 3).map((p) => (
                            <p key={p.id} className="text-sm mb-1" dangerouslySetInnerHTML={{ __html: p.content }} />
                        ))}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Tags</h3>
                        {trendingTags?.slice(0, 3).map((t) => (
                            <p key={t.name} className="text-sm">#{t.name}</p>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Links</h3>
                        {trendingLinks?.slice(0, 3).map((l) => (
                            <a key={l.url} href={l.url} className="text-sm text-blue-400 block truncate">
                                {l.title || l.url}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MODERATION --- */}
            <section className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3">🚫 Moderation</h2>
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <h3 className="font-medium mb-2">Muted Users</h3>
                        {mutedUsers?.length ? (
                            mutedUsers.map((u) => <p key={u.id}>@{u.acct}</p>)
                        ) : (
                            <p className="text-gray-400">No muted users</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Muted Words</h3>
                        {mutedWords?.length ? (
                            mutedWords.map((f) => <p key={f.id}>{f.title}</p>)
                        ) : (
                            <p className="text-gray-400">No muted filters</p>
                        )}
                    </div>
                </div>
            </section>

            {/* --- STREAMING --- */}
            <section className="bg-gray-900/20 p-5 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-3">🔴 Live Stream (Public)</h2>
                {events.slice(0, 5).map((ev) => (
                    <div key={ev.id} className="text-sm border-b border-gray-700 py-1" dangerouslySetInnerHTML={{ __html: ev.content }} />
                ))}
            </section>
        </main>
    );
}
