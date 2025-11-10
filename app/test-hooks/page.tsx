/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useBookmarkStatus } from "@/hooks/mutations/use-bookmark-status.hook"
import { useFavouriteStatus } from "@/hooks/mutations/use-favourite-status.hook"
import { useAddMutedWord } from "@/hooks/mutations/use-mute-actions.hook"
import { usePostStatus } from "@/hooks/mutations/use-post-status.hook"
import { useReblogStatus } from "@/hooks/mutations/use-reblog-status.hook"
import { useHomeTimeline } from "@/hooks/use-home-timeline.hook"
import { useMutedUsers } from "@/hooks/use-muted-users.hook"
import { useMutedWords } from "@/hooks/use-muted-words.hook"
import { usePublicTimeline } from "@/hooks/use-public-timeline.hook"
import { useStreamingTimeline } from "@/hooks/use-streaming-timeline.hook"
import { useTrendingLinks } from "@/hooks/use-trending-links.hook"
import { useTrendingPosts } from "@/hooks/use-trending-posts.hook"
import { useTrendingTags } from "@/hooks/use-trending-tags.hook"
import { useUserProfileInfo } from "@/hooks/use-user-profile-info.hook"
import {
    Bookmark,
    ChevronDown,
    ChevronRight,
    Copy,
    Heart,
    Home,
    MessageCircle,
    Monitor,
    Repeat2,
    Search,
    Send,
    Settings,
    TrendingUp,
    User,
    VolumeX,
    Zap,
} from "lucide-react"
import { useState } from "react"

type HookKey =
    | "useUserProfileInfo"
    | "useHomeTimeline"
    | "usePublicTimeline"
    | "useTrendingPosts"
    | "useTrendingTags"
    | "useTrendingLinks"
    | "useMutedUsers"
    | "useMutedWords"
    | "useStreamingTimeline"
    | "usePostStatus"
    | "useFavouriteStatus"
    | "useReblogStatus"
    | "useBookmarkStatus"
    | "useAddMutedWord"

const hookCategories = [
    {
        name: "Authentication & Client",
        icon: <Settings className="w-4 h-4" />,
        hooks: [
            { key: "useMastoClient", label: "useMastoClient", desc: "Creates authenticated REST client", type: "Utility" },
            {
                key: "useUserSession",
                label: "useUserSession",
                desc: "Manages access token from cookies/storage",
                type: "Utility",
            },
        ],
    },
    {
        name: "User Info & Relations",
        icon: <User className="w-4 h-4" />,
        hooks: [
            {
                key: "useUserProfileInfo",
                label: "useUserProfileInfo",
                desc: "Fetches your profile (name, avatar, stats)",
                type: "Query",
            },
            { key: "useUserPosts", label: "useUserPosts", desc: "Your or any user's posts", type: "Query" },
            { key: "useUserFollowers", label: "useUserFollowers", desc: "List of followers", type: "Query" },
            { key: "useUserFollowing", label: "useUserFollowing", desc: "Accounts you follow", type: "Query" },
        ],
    },
    {
        name: "Timelines",
        icon: <Home className="w-4 h-4" />,
        hooks: [
            { key: "useHomeTimeline", label: "useHomeTimeline", desc: "Your personalized feed", type: "Query" },
            { key: "usePublicTimeline", label: "usePublicTimeline", desc: "Global public posts", type: "Query" },
            { key: "useHashtagTimeline", label: "useHashtagTimeline", desc: "Posts by hashtag", type: "Query" },
            { key: "useStreamingTimeline", label: "useStreamingTimeline", desc: "Live WebSocket stream", type: "Stream" },
        ],
    },
    {
        name: "Posting & Media",
        icon: <Send className="w-4 h-4" />,
        hooks: [
            { key: "usePostStatus", label: "usePostStatus", desc: "Create a new post", type: "Mutation" },
            { key: "useReplyStatus", label: "useReplyStatus", desc: "Reply to a post", type: "Mutation" },
            { key: "useUploadMedia", label: "useUploadMedia", desc: "Upload images/videos", type: "Mutation" },
        ],
    },
    {
        name: "Interactions",
        icon: <Heart className="w-4 h-4" />,
        hooks: [
            { key: "useFavouriteStatus", label: "useFavouriteStatus", desc: "Like a post", type: "Mutation" },
            { key: "useReblogStatus", label: "useReblogStatus", desc: "Boost/reblog", type: "Mutation" },
            { key: "useBookmarkStatus", label: "useBookmarkStatus", desc: "Add to bookmarks", type: "Mutation" },
            { key: "useToggleFavourite", label: "useToggleFavourite", desc: "Toggle like state", type: "Mutation" },
        ],
    },
    {
        name: "Notifications & Mentions",
        icon: <MessageCircle className="w-4 h-4" />,
        hooks: [
            { key: "useNotifications", label: "useNotifications", desc: "Mentions, boosts, likes", type: "Query" },
            { key: "usePrivateMentions", label: "usePrivateMentions", desc: "Direct messages", type: "Query" },
        ],
    },
    {
        name: "Trending Content",
        icon: <TrendingUp className="w-4 h-4" />,
        hooks: [
            { key: "useTrendingPosts", label: "useTrendingPosts", desc: "Hot posts right now", type: "Query" },
            { key: "useTrendingTags", label: "useTrendingTags", desc: "Popular hashtags", type: "Query" },
            { key: "useTrendingLinks", label: "useTrendingLinks", desc: "Viral shared links", type: "Query" },
        ],
    },
    {
        name: "Moderation & Filters",
        icon: <VolumeX className="w-4 h-4" />,
        hooks: [
            { key: "useMutedUsers", label: "useMutedUsers", desc: "Muted accounts", type: "Query" },
            { key: "useMutedWords", label: "useMutedWords", desc: "Keyword filters", type: "Query" },
            { key: "useMutedDomains", label: "useMutedDomains", desc: "Blocked domains", type: "Query" },
            { key: "useAddMutedWord", label: "useAddMutedWord", desc: "Add mute filter", type: "Mutation" },
        ],
    },
]

export default function HookLab() {
    const [selectedHook, setSelectedHook] = useState<HookKey | null>(null)
    const [search, setSearch] = useState("")
    const [expandedCats, setExpandedCats] = useState<string[]>(["User Info & Relations", "Timelines", "Interactions"])
    const [lastOutput, setLastOutput] = useState<any>(null)
    const [status, setStatus] = useState("")
    const [statusId, setStatusId] = useState("")
    const [muteWord, setMuteWord] = useState("")

    // Active hooks
    const { data: user } = useUserProfileInfo()
    const { data: homeFeed } = useHomeTimeline()
    const { data: publicFeed } = usePublicTimeline()
    const { data: trendingPosts } = useTrendingPosts()
    const { data: trendingTags } = useTrendingTags()
    const { data: trendingLinks } = useTrendingLinks()
    const { data: mutedUsers } = useMutedUsers()
    const { data: mutedWords } = useMutedWords()
    const { events } = useStreamingTimeline("public")
    const { mutateAsync: postStatus } = usePostStatus()
    const { mutateAsync: favourite } = useFavouriteStatus()
    const { mutateAsync: reblog } = useReblogStatus()
    const { mutateAsync: bookmark } = useBookmarkStatus()
    const { mutateAsync: addMutedWord } = useAddMutedWord()

    const run = async (fn: () => Promise<any>) => {
        try {
            const res = await fn()
            setLastOutput({ success: true, data: res, timestamp: new Date().toISOString() })
        } catch (e: any) {
            setLastOutput({ success: false, error: e.message || String(e), timestamp: new Date().toISOString() })
        }
    }

    const selectedHookData = hookCategories.flatMap((c) => c.hooks).find((h) => h.key === selectedHook)

    const filteredCategories = hookCategories
        .map((cat) => ({
            ...cat,
            hooks: cat.hooks.filter((h) => h.label.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter((cat) => cat.hooks.length > 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 text-foreground flex flex-col h-screen">
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar is now fixed height (h-screen) and width, doesn't scroll with main content */}
                <aside className="w-72 h-screen border-r border-blue-600/20 flex flex-col overflow-hidden flex-shrink-0 fixed left-0 top-0">
                    {/* Sticky search header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-b from-card to-card/80 backdrop-blur border-b border-blue-600/20 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                placeholder="Search hooks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Sidebar body scrolls independently */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-card via-card to-blue-950/5">
                        <div className="p-4 space-y-3">
                            {filteredCategories.map((cat) => (
                                <div key={cat.name}>
                                    <button
                                        onClick={() =>
                                            setExpandedCats((prev) =>
                                                prev.includes(cat.name) ? prev.filter((c) => c !== cat.name) : [...prev, cat.name],
                                            )
                                        }
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600/10 transition border border-transparent hover:border-blue-600/20"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">{cat.icon}</span>
                                            <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                                        </div>
                                        {expandedCats.includes(cat.name) ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>

                                    {expandedCats.includes(cat.name) && (
                                        <div className="mt-2 space-y-1 pl-6">
                                            {cat.hooks.map((hook) => (
                                                <button
                                                    key={hook.key}
                                                    onClick={() => setSelectedHook(hook.key as HookKey)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${selectedHook === hook.key
                                                        ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border border-blue-600/50 text-blue-300 font-medium shadow-lg"
                                                        : "hover:bg-blue-600/5 text-muted-foreground border border-transparent hover:border-blue-600/20"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{hook.label}</span>
                                                        <span className="text-xs opacity-70">{hook.type}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">{hook.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main content offset to account for fixed sidebar */}
                <main className="flex-1 flex flex-col overflow-hidden ml-72">
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-8">
                            {!selectedHook ? (
                                <div className="text-center py-20">
                                    <Monitor className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                                    <h2 className="text-3xl font-bold text-muted-foreground">Select a hook to explore</h2>
                                    <p className="text-muted-foreground mt-4">
                                        Click any hook from the sidebar to view live data, usage, and test mutations
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8 pb-8">
                                    <div className="bg-gradient-to-br from-card via-card to-blue-950/10 border border-blue-606/30 rounded-2xl p-8 shadow-lg">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h1 className="text-3xl font-bold text-foreground">{selectedHookData?.label}</h1>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 rounded-full text-xs font-medium border border-blue-600/30">
                                                        {selectedHookData?.type}
                                                    </span>
                                                    <code className="text-sm bg-gradient-to-r from-input to-blue-950/20 px-3 py-1 rounded border border-blue-600/30">
                                                        {selectedHook}
                                                    </code>
                                                </div>
                                                <p className="text-foreground mt-4 text-lg">{selectedHookData?.desc}</p>
                                            </div>
                                            <button className="p-3 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 rounded-xl hover:bg-blue-600/30 transition border border-blue-600/30">
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hook-Specific Demo */}
                                    {selectedHook === "useUserProfileInfo" && user && (
                                        <DemoCard title="Live Data">
                                            <div className="flex items-center gap-6">
                                                <img
                                                    src={user.avatar || "/placeholder.svg"}
                                                    alt=""
                                                    className="w-24 h-24 rounded-full ring-4 ring-blue-500"
                                                />
                                                <div>
                                                    <p className="text-2xl font-bold">{user.displayName}</p>
                                                    <p className="text-muted-foreground">@{user.acct}</p>
                                                    <div className="flex gap-6 mt-4 text-sm">
                                                        <div>
                                                            <strong>{user.statusesCount}</strong> posts
                                                        </div>
                                                        <div>
                                                            <strong>{user.followersCount}</strong> followers
                                                        </div>
                                                        <div>
                                                            <strong>{user.followingCount}</strong> following
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "usePostStatus" && (
                                        <DemoCard title="Test Mutation">
                                            <textarea
                                                placeholder="What's happening?"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="w-full h-32 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => run(() => postStatus({ status }))}
                                                className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition text-white"
                                            >
                                                <Send className="w-5 h-5 inline mr-2" /> Post Status
                                            </button>
                                        </DemoCard>
                                    )}

                                    {["useFavouriteStatus", "useReblogStatus", "useBookmarkStatus"].includes(selectedHook) && (
                                        <DemoCard title="Test Interaction">
                                            <input
                                                placeholder="Enter Status ID"
                                                value={statusId}
                                                onChange={(e) => setStatusId(e.target.value)}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                            <div className="flex gap-3 mt-4">
                                                {selectedHook === "useFavouriteStatus" && (
                                                    <button
                                                        onClick={() => run(() => favourite(statusId))}
                                                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-pink-500/50 text-white font-medium transition-all"
                                                    >
                                                        <Heart className="w-5 h-5 inline mr-2" /> Favourite
                                                    </button>
                                                )}
                                                {selectedHook === "useReblogStatus" && (
                                                    <button
                                                        onClick={() => run(() => reblog(statusId))}
                                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:shadow-lg hover:shadow-green-500/50 text-white font-medium transition-all"
                                                    >
                                                        <Repeat2 className="w-5 h-5 inline mr-2" /> Reblog
                                                    </button>
                                                )}
                                                {selectedHook === "useBookmarkStatus" && (
                                                    <button
                                                        onClick={() => run(() => bookmark(statusId))}
                                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 text-white font-medium transition-all"
                                                    >
                                                        <Bookmark className="w-5 h-5 inline mr-2" /> Bookmark
                                                    </button>
                                                )}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useAddMutedWord" && (
                                        <DemoCard title="Add Filter">
                                            <input
                                                placeholder="e.g., crypto, nft"
                                                value={muteWord}
                                                onChange={(e) => setMuteWord(e.target.value)}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => run(() => addMutedWord({ phrase: muteWord }))}
                                                className="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500/50 text-white font-medium transition-all"
                                            >
                                                <VolumeX className="w-5 h-5 inline mr-2" /> Mute Word
                                            </button>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useStreamingTimeline" && (
                                        <DemoCard title="Live Stream">
                                            <div className="bg-gradient-to-r from-input to-blue-950/20 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm border border-blue-600/30">
                                                {events?.slice(0, 15).map((ev) => (
                                                    <div key={ev.id} className="py-2 border-b border-blue-600/20 last:border-0">
                                                        <span className="text-green-400">● Live</span>{" "}
                                                        <span className="text-muted-foreground text-xs">@{ev.account.acct}</span>
                                                        <div dangerouslySetInnerHTML={{ __html: ev.content }} />
                                                    </div>
                                                )) || <p className="text-muted-foreground">Waiting for events...</p>}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {["useHomeTimeline", "usePublicTimeline", "useTrendingPosts"].includes(selectedHook) && (
                                        <DemoCard title="Feed Preview">
                                            <div className="space-y-4">
                                                {(selectedHook === "useHomeTimeline"
                                                    ? homeFeed
                                                    : selectedHook === "usePublicTimeline"
                                                        ? publicFeed
                                                        : trendingPosts
                                                )
                                                    ?.slice(0, 5)
                                                    .map((p: any) => (
                                                        <div
                                                            key={p.id}
                                                            className="bg-gradient-to-r from-input to-blue-950/20 rounded-xl p-4 border border-blue-600/30"
                                                        >
                                                            <p className="text-sm font-medium">@{p.account.acct}</p>
                                                            <div className="mt-2" dangerouslySetInnerHTML={{ __html: p.content }} />
                                                        </div>
                                                    ))}
                                            </div>
                                        </DemoCard>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-blue-600/20 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm">
                        <div className="max-w-4xl mx-auto px-8 py-4">
                            <div className="bg-gradient-to-br from-card via-blue-950/20 to-card border border-blue-600/40 rounded-xl shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-card to-blue-950/10 border-b border-blue-600/30">
                                    <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm">
                                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                                        Response Log
                                    </h3>
                                    <button
                                        onClick={() => setLastOutput(null)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-blue-600/10 border border-transparent hover:border-blue-600/20"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <pre className="p-4 bg-gradient-to-br from-input via-blue-950/30 to-input text-xs font-mono max-h-48 overflow-auto text-foreground border-t border-blue-600/20">
                                    {lastOutput ? (
                                        <code className={lastOutput.success ? "text-green-400" : "text-red-400"}>
                                            {JSON.stringify(lastOutput, null, 2)}
                                        </code>
                                    ) : (
                                        <span className="text-muted-foreground">No response yet. Trigger a mutation to see output.</span>
                                    )}
                                </pre>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-br from-card via-card to-blue-950/10 border border-blue-606/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                {title}
            </h3>
            {children}
        </div>
    )
}
