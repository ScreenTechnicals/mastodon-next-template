/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useBookmarkStatus } from "@/hooks/mutations/use-bookmark-status.hook"
import { useFavouriteStatus } from "@/hooks/mutations/use-favourite-status.hook"
import { useFollowUser } from "@/hooks/mutations/use-follow-user.hook"
import { useAddMutedWord } from "@/hooks/mutations/use-mute-actions.hook"
import { usePostStatus } from "@/hooks/mutations/use-post-status.hook"
import { useReblogStatus } from "@/hooks/mutations/use-reblog-status.hook"
import { useHomeTimeline } from "@/hooks/use-home-timeline.hook"
import { useMutedUsers } from "@/hooks/use-muted-users.hook"
import { useMutedWords } from "@/hooks/use-muted-words.hook"
import { usePublicTimeline } from "@/hooks/use-public-timeline.hook"
import { useSearchOrUrl } from "@/hooks/use-search-or-url.hook"
import { useStreamingTimeline } from "@/hooks/use-streaming-timeline.hook"
import { useTrendingLinks } from "@/hooks/use-trending-links.hook"
import { useTrendingPosts } from "@/hooks/use-trending-posts.hook"
import { useTrendingTags } from "@/hooks/use-trending-tags.hook"
import { useUserFollowers } from "@/hooks/use-user-followers.hook"
import { useUserFollowing } from "@/hooks/use-user-following.hook"
import { useUserPosts } from "@/hooks/use-user-posts.hook"
import { useUserProfileInfo } from "@/hooks/use-user-profile-info.hook"
import { useWhoToFollow } from "@/hooks/use-who-to-follow.hook"
import {
    Bookmark, ChevronDown, ChevronRight,
    Clock,
    Copy, Heart, Home,
    Monitor,
    RefreshCw,
    Repeat2, Search, Send, Settings,
    TrendingUp, User, VolumeX,
    XCircle,
    Zap
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

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
    | "useUserFollowing"
    | "useUserFollowers"
    | "useUserPosts"
    | "useWhoToFollow"
    | "useSearchOrUrl"

const hookCategories = [
    {
        name: "Authentication & Client",
        icon: <Settings className="w-4 h-4" />,
        hooks: [
            { key: "useMastoClient", label: "useMastoClient", desc: "Authenticated REST client", type: "Utility" },
            { key: "useUserSession", label: "useUserSession", desc: "Token from cookies/storage", type: "Utility" },
        ],
    },
    {
        name: "User Info & Relations",
        icon: <User className="w-4 h-4" />,
        hooks: [
            { key: "useUserProfileInfo", label: "useUserProfileInfo", desc: "Your profile & stats", type: "Query" },
            { key: "useUserPosts", label: "useUserPosts", desc: "Your recent posts", type: "Query" },
            { key: "useUserFollowers", label: "useUserFollowers", desc: "Who follows you", type: "Query" },
            { key: "useUserFollowing", label: "useUserFollowing", desc: "Accounts you follow", type: "Query" },
        ],
    },
    {
        name: "Timelines",
        icon: <Home className="w-4 h-4" />,
        hooks: [
            { key: "useHomeTimeline", label: "useHomeTimeline", desc: "Your personalized feed", type: "Query" },
            { key: "usePublicTimeline", label: "usePublicTimeline", desc: "Global public posts", type: "Query" },
            { key: "useStreamingTimeline", label: "useStreamingTimeline", desc: "Live WebSocket stream", type: "Stream" },
        ],
    },
    {
        name: "Posting & Media",
        icon: <Send className="w-4 h-4" />,
        hooks: [
            { key: "usePostStatus", label: "usePostStatus", desc: "Create a new post", type: "Mutation" },
        ],
    },
    {
        name: "Interactions",
        icon: <Heart className="w-4 h-4" />,
        hooks: [
            { key: "useFavouriteStatus", label: "useFavouriteStatus", desc: "Like a post", type: "Mutation" },
            { key: "useReblogStatus", label: "useReblogStatus", desc: "Boost/reblog", type: "Mutation" },
            { key: "useBookmarkStatus", label: "useBookmarkStatus", desc: "Add to bookmarks", type: "Mutation" },
        ],
    },
    {
        name: "Discovery",
        icon: <Search className="w-4 h-4" />,
        hooks: [
            { key: "useSearchOrUrl", label: "useSearchOrUrl", desc: "Search or resolve Mastodon URLs", type: "Query" },
            { key: "useWhoToFollow", label: "useWhoToFollow", desc: "Suggested accounts to follow", type: "Query" },
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
            { key: "useAddMutedWord", label: "useAddMutedWord", desc: "Add mute filter", type: "Mutation" },
        ],
    },
]

export default function HookLab() {
    const [selectedHook, setSelectedHook] = useState<HookKey | null>(null)
    const [search, setSearch] = useState("")
    const [expandedCats, setExpandedCats] = useState<string[]>([
        "User Info & Relations", "Timelines", "Interactions", "Posting & Media",
        "Trending Content", "Moderation & Filters"
    ])
    const [lastOutput, setLastOutput] = useState<any>(null)
    const [status, setStatus] = useState("")
    const [statusId, setStatusId] = useState("")
    const [muteWord, setMuteWord] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    // All hooks
    const { data: user } = useUserProfileInfo()
    const { data: homeFeed, refetch: refetchHome } = useHomeTimeline()
    const { data: publicFeed, refetch: refetchPublic } = usePublicTimeline()
    const { data: trendingPosts, refetch: refetchTrendingPosts } = useTrendingPosts()
    const { data: trendingTags, refetch: refetchTrendingTags } = useTrendingTags()
    const { data: trendingLinks, refetch: refetchTrendingLinks } = useTrendingLinks()
    const { data: mutedUsers, refetch: refetchMutedUsers } = useMutedUsers()
    const { data: mutedWords, refetch: refetchMutedWords } = useMutedWords()
    const { events } = useStreamingTimeline("public")
    const { mutateAsync: postStatus } = usePostStatus()
    const { mutateAsync: favourite } = useFavouriteStatus()
    const { mutateAsync: reblog } = useReblogStatus()
    const { mutateAsync: bookmark } = useBookmarkStatus()
    const { mutateAsync: addMutedWord } = useAddMutedWord()
    const { data: userPosts, refetch: refetchUserPosts } = useUserPosts()
    const { data: userFollowing, refetch: refetchFollowing } = useUserFollowing()
    const { data: userFollowers, refetch: refetchFollowers } = useUserFollowers()
    // Discovery
    const { data: searchResults, refetch: refetchSearch } = useSearchOrUrl(searchTerm)
    const { data: whoToFollow, refetch: refetchWhoToFollow } = useWhoToFollow()
    const { mutateAsync: followUser, isPending: followPending } = useFollowUser()

    const recentPosts = homeFeed?.slice(0, 10) || []

    const run = async (fn: () => Promise<any>, successMsg: string, loadingMsg?: string) => {
        const id = toast.loading(loadingMsg || "Processing...")
        try {
            const res = await fn()
            setLastOutput({ success: true, data: res, timestamp: new Date().toISOString() })
            toast.success(successMsg, { id })
        } catch (e: any) {
            setLastOutput({ success: false, error: e.message || String(e), timestamp: new Date().toISOString() })
            toast.error(e.message || "Failed", { id })
        }
    }

    const triggerQuery = async (name: string, refetchFn: () => Promise<any>) => {
        const id = toast.loading(`Fetching ${name}...`)
        try {
            const { data } = await refetchFn()
            setLastOutput({ success: true, query: name, data, timestamp: new Date().toISOString() })
            toast.success(`${name} loaded!`, { id })
        } catch (e: any) {
            setLastOutput({ success: false, error: e.message, timestamp: new Date().toISOString() })
            toast.error("Failed to load", { id })
        }
    }

    const copyText = (text: string, label: string = "Text") => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`, {
            description: text.length > 40 ? text.slice(0, 37) + "..." : text,
            icon: <Copy className="w-4 h-4" />
        })
    }

    const selectedHookData = hookCategories.flatMap(c => c.hooks).find(h => h.key === selectedHook)
    const filteredCategories = hookCategories
        .map(cat => ({
            ...cat,
            hooks: cat.hooks.filter(h => h.label.toLowerCase().includes(search.toLowerCase()))
        }))
        .filter(cat => cat.hooks.length > 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 text-foreground flex flex-col h-screen">
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 h-screen border-r border-blue-600/20 flex flex-col overflow-hidden fixed left-0 top-0 z-50">
                    <div className="sticky top-0 z-10 bg-gradient-to-b from-card to-card/80 backdrop-blur border-b border-blue-600/20 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                placeholder="Search hooks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-card via-card to-blue-950/5">
                        <div className="p-4 space-y-3">
                            {filteredCategories.map((cat) => (
                                <div key={cat.name}>
                                    <button
                                        onClick={() => setExpandedCats(prev =>
                                            prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name]
                                        )}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600/10 transition border border-transparent hover:border-blue-600/20"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">{cat.icon}</span>
                                            <span className="text-sm font-semibold">{cat.name}</span>
                                        </div>
                                        {expandedCats.includes(cat.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                    {expandedCats.includes(cat.name) && (
                                        <div className="mt-2 space-y-1 pl-6">
                                            {cat.hooks.map((hook) => (
                                                <button
                                                    key={hook.key}
                                                    onClick={() => {
                                                        setSelectedHook(hook.key as HookKey)
                                                        toast.info(`Switched to ${hook.label}`)
                                                    }}
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

                {/* Main */}
                <main className="flex-1 flex flex-col overflow-hidden ml-72">
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-8">
                            {!selectedHook ? (
                                <div className="text-center py-20">
                                    <Monitor className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                                    <h2 className="text-3xl font-bold text-muted-foreground">Select a hook to explore</h2>
                                    <p className="text-muted-foreground mt-4">Live data, mutations, streaming — all in one lab</p>
                                </div>
                            ) : (
                                <div className="space-y-8 pb-8">
                                    {/* Header */}
                                    <div className="bg-gradient-to-br from-card via-card to-blue-950/10 border border-blue-600/30 rounded-2xl p-8 shadow-lg">
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
                                            <button
                                                onClick={() => copyText(selectedHook || "", "Hook name")}
                                                className="p-3 bg-gradient-to-br from-blue-600/20 to-cyan-500/10 rounded-xl hover:bg-blue-600/30 transition border border-blue-600/30"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* === FULL DEMOS === */}
                                    {selectedHook === "useUserProfileInfo" && user && (
                                        <DemoCard title="Live Profile">
                                            <button onClick={() => triggerQuery("useUserProfileInfo", async () => ({ data: user }))} className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now
                                            </button>
                                            <div className="flex items-center gap-6">
                                                <img src={user.avatar} alt="" className="w-24 h-24 rounded-full ring-4 ring-blue-500 shadow-xl" />
                                                <div>
                                                    <p className="text-2xl font-bold">{user.displayName}</p>
                                                    <p className="text-muted-foreground">@{user.acct}</p>
                                                    <button onClick={() => copyText(user.acct, "Username")} className="text-xs opacity-70 hover:opacity-100 mt-2 inline-flex items-center gap-1">
                                                        <Copy className="w-3.5 h-3.5" /> Copy @
                                                    </button>
                                                    <div className="flex gap-6 mt-4 text-sm">
                                                        <div><strong>{user.statusesCount}</strong> posts</div>
                                                        <div><strong>{user.followersCount}</strong> followers</div>
                                                        <div><strong>{user.followingCount}</strong> following</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useUserFollowing" && (
                                        <DemoCard title="Accounts You Follow">
                                            <button onClick={() => triggerQuery("useUserFollowing", refetchFollowing)} className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now ({userFollowing?.length || 0})
                                            </button>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {userFollowing?.slice(0, 15).map((acc: any) => (
                                                    <div key={acc.id} className="flex items-center gap-4 p-4 bg-input/50 rounded-xl border border-blue-600/20 hover:border-blue-500/50 transition">
                                                        <img src={acc.avatar} alt="" className="w-12 h-12 rounded-full" />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{acc.displayName}</p>
                                                            <p className="text-sm text-muted-foreground">@{acc.acct}</p>
                                                        </div>
                                                        <button onClick={() => copyText(acc.acct, "Username")} className="text-xs opacity-70 hover:opacity-100">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useUserFollowers" && (
                                        <DemoCard title="Your Followers">
                                            <button onClick={() => triggerQuery("useUserFollowers", refetchFollowers)} className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now ({userFollowers?.length || 0})
                                            </button>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {userFollowers?.slice(0, 15).map((acc: any) => (
                                                    <div key={acc.id} className="flex items-center gap-4 p-4 bg-input/50 rounded-xl border border-blue-600/20">
                                                        <img src={acc.avatar} alt="" className="w-12-12 h-12 rounded-full" />
                                                        <div>
                                                            <p className="font-medium">{acc.displayName}</p>
                                                            <p className="text-sm text-muted-foreground">@{acc.acct}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useUserPosts" && (
                                        <DemoCard title="Your Recent Posts">
                                            <button onClick={() => triggerQuery("useUserPosts", refetchUserPosts)} className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now
                                            </button>
                                            <div className="space-y-4">
                                                {userPosts?.slice(0, 6).map((p: any) => (
                                                    <div key={p.id} className="bg-input/50 rounded-xl p-5 border border-blue-600/20">
                                                        <div dangerouslySetInnerHTML={{ __html: p.content }} />
                                                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(p.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useMutedUsers" && (
                                        <DemoCard title="Muted Accounts">
                                            <button onClick={() => triggerQuery("useMutedUsers", refetchMutedUsers)} className="mb-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now ({mutedUsers?.length || 0})
                                            </button>
                                            <div className="grid grid-cols-2 gap-3">
                                                {mutedUsers?.map((u: any) => (
                                                    <div key={u.id} className="flex items-center gap-3 p-3 bg-red-950/20 rounded-lg border border-red-600/30">
                                                        <img src={u.avatar} alt="" className="w-10 h-10 rounded-full" />
                                                        <p className="text-sm font-medium">@{u.acct}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useMutedWords" && (
                                        <DemoCard title="Muted Keywords">
                                            <button onClick={() => triggerQuery("useMutedWords", refetchMutedWords)} className="mb-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now ({mutedWords?.length || 0})
                                            </button>
                                            <div className="flex flex-wrap gap-2">
                                                {mutedWords?.map((word, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-600/20 border border-red-500/50 rounded-full text-sm flex items-center gap-2">
                                                        #{String(word)}
                                                        <XCircle className="w-3 h-3 opacity-50 hover:opacity-100 cursor-pointer" />
                                                    </span>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useTrendingTags" && (
                                        <DemoCard title="Trending Hashtags">
                                            <button onClick={() => triggerQuery("useTrendingTags", refetchTrendingTags)} className="mb-4 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now
                                            </button>
                                            <div className="grid grid-cols-3 gap-4">
                                                {trendingTags?.slice(0, 9).map((tag: any) => (
                                                    <div key={tag.name} className="p-4 bg-purple-950/20 rounded-xl border border-purple-600/40 text-center">
                                                        <p className="text-lg font-bold">#{tag.name}</p>
                                                        <p className="text-xs text-muted-foreground">{tag.history[0]?.accounts} accounts</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useTrendingLinks" && (
                                        <DemoCard title="Trending Links">
                                            <button onClick={() => triggerQuery("useTrendingLinks", refetchTrendingLinks)} className="mb-4 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now
                                            </button>
                                            <div className="space-y-3">
                                                {trendingLinks?.slice(0, 8).map((link: any) => (
                                                    <a href={link.url} target="_blank" key={link.url} className="block p-4 bg-cyan-950/20 rounded-xl border border-cyan-600/40 hover:border-cyan-500/60 transition">
                                                        <p className="font-medium text-cyan-300">{link.title || link.url}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{link.history[0]?.accounts} shares today</p>
                                                    </a>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {/* FULL MUTATION UI WITH SUGGESTIONS */}
                                    {["useFavouriteStatus", "useReblogStatus", "useBookmarkStatus", "useAddMutedWord", "usePostStatus"].includes(selectedHook) && (
                                        <DemoCard title="Test Mutation">
                                            {selectedHook === "usePostStatus" && (
                                                <textarea
                                                    placeholder="What's happening?"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    className="w-full h-32 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            )}
                                            {["useFavouriteStatus", "useReblogStatus", "useBookmarkStatus"].includes(selectedHook) && (
                                                <input
                                                    placeholder="Enter Status ID"
                                                    value={statusId}
                                                    onChange={(e) => setStatusId(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            )}
                                            {selectedHook === "useAddMutedWord" && (
                                                <input
                                                    placeholder="e.g., crypto, nft"
                                                    value={muteWord}
                                                    onChange={(e) => setMuteWord(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            )}

                                            <div className="flex gap-3 mt-4">
                                                {selectedHook === "usePostStatus" && (
                                                    <button
                                                        onClick={() => run(() => postStatus({ status }), "Posted successfully!", "Posting...")}
                                                        disabled={!status.trim()}
                                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition text-white disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        <Send className="w-5 h-5" /> Post
                                                    </button>
                                                )}
                                                {selectedHook === "useFavouriteStatus" && (
                                                    <button onClick={() => run(() => favourite(statusId), "Favorited!", "Favoriting...")} disabled={!statusId} className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-pink-500/50 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                                                        <Heart className="w-5 h-5" /> Favourite
                                                    </button>
                                                )}
                                                {selectedHook === "useReblogStatus" && (
                                                    <button onClick={() => run(() => reblog(statusId), "Reblogged!", "Reblogging...")} disabled={!statusId} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:shadow-lg hover:shadow-green-500/50 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                                                        <Repeat2 className="w-5 h-5" /> Reblog
                                                    </button>
                                                )}
                                                {selectedHook === "useBookmarkStatus" && (
                                                    <button onClick={() => run(() => bookmark(statusId), "Bookmarked!", "Bookmarking...")} disabled={!statusId} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                                                        <Bookmark className="w-5 h-5" /> Bookmark
                                                    </button>
                                                )}
                                                {selectedHook === "useAddMutedWord" && (
                                                    <button onClick={() => run(() => addMutedWord({ phrase: muteWord }), `Muted "${muteWord}"`, "Adding mute...")} disabled={!muteWord.trim()} className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500/50 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                                                        <VolumeX className="w-5 h-5" /> Mute Word
                                                    </button>
                                                )}
                                            </div>

                                            {recentPosts.length > 0 && (
                                                <div className="mt-8">
                                                    <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                                        <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                        Try with a real post:
                                                    </p>
                                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                                        {recentPosts.map((post: any) => {
                                                            const cleanText = post.content.replace(/<[^>]*>/g, "").trim()
                                                            const firstWord = cleanText.split(/\s+/)[0]?.replace(/[^\w]/g, "") || ""
                                                            const shortId = post.id.slice(-8)

                                                            return (
                                                                <div key={post.id} className="bg-gradient-to-r from-input to-blue-950/20 rounded-xl p-5 border border-blue-600/30 hover:border-blue-500/60 transition-all group">
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-blue-300">@{post.account.acct}</p>
                                                                            <p className="text-sm text-foreground mt-1 line-clamp-2">{cleanText}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                                        {["useFavouriteStatus", "useReblogStatus", "useBookmarkStatus"].includes(selectedHook) && (
                                                                            <button onClick={() => {
                                                                                setStatusId(post.id)
                                                                                toast.success("Status ID loaded!", { description: `...${shortId}` })
                                                                            }} className="text-xs px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg border border-blue-500/60 text-blue-200 font-medium transition-all">
                                                                                Use ID: ...{shortId}
                                                                            </button>
                                                                        )}
                                                                        {selectedHook === "useAddMutedWord" && firstWord.length > 2 && (
                                                                            <button onClick={() => {
                                                                                setMuteWord(firstWord)
                                                                                toast.info(`Ready to mute #${firstWord}`)
                                                                            }} className="text-xs px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-500/60 text-red-200 font-medium transition-all">
                                                                                Mute #{firstWord}
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => copyText(post.id, "Status ID")} className="text-xs px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/70 rounded-lg border border-gray-500/50 text-gray-300 transition-all">
                                                                            Copy ID
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </DemoCard>
                                    )}

                                    {/* Other hooks... */}
                                    {["useHomeTimeline", "usePublicTimeline", "useTrendingPosts"].includes(selectedHook) && (
                                        <DemoCard title="Live Feed">
                                            <button onClick={() => triggerQuery(selectedHook, selectedHook === "useHomeTimeline" ? refetchHome : selectedHook === "usePublicTimeline" ? refetchPublic : refetchTrendingPosts)} className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" /> Trigger Now
                                            </button>
                                            <div className="space-y-4">
                                                {(selectedHook === "useHomeTimeline" ? homeFeed : selectedHook === "usePublicTimeline" ? publicFeed : trendingPosts)?.slice(0, 5).map((p: any) => (
                                                    <div key={p.id} className="bg-input/50 rounded-xl p-5 border border-blue-600/20">
                                                        <p className="text-sm font-medium text-blue-300">@{p.account.acct}</p>
                                                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: p.content }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                    {selectedHook === "useStreamingTimeline" && (
                                        <DemoCard title="Live Public Stream">
                                            <div className="bg-input/50 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm border border-blue-600/30">
                                                {events?.slice(0, 20).map((ev: any) => (
                                                    <div key={ev.id} className="py-3 border-b border-blue-600/20 last:border-0">
                                                        <span className="text-green-400">Live</span> <span className="text-cyan-400">@{ev.account.acct}</span>
                                                        <div className="mt-1" dangerouslySetInnerHTML={{ __html: ev.content }} />
                                                    </div>
                                                )) || <p className="text-muted-foreground">Waiting for live events...</p>}
                                            </div>
                                        </DemoCard>
                                    )}
                                    {selectedHook === "useSearchOrUrl" && (
                                        <DemoCard title="Search or Paste URL">
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search posts, hashtags, or paste a Mastodon URL..."
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-input to-blue-950/20 border border-blue-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                                <button
                                                    onClick={() => triggerQuery("useSearchOrUrl", refetchSearch)}
                                                    disabled={!searchTerm.trim()}
                                                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2"
                                                >
                                                    <Search className="w-4 h-4" /> Search
                                                </button>
                                            </div>

                                            {searchResults && (
                                                <div className="space-y-6">
                                                    {searchResults.statuses.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-blue-400 mb-2">Statuses</h4>
                                                            <div className="space-y-3">
                                                                {searchResults.statuses.slice(0, 5).map((s) => (
                                                                    <div
                                                                        key={s.id}
                                                                        className="bg-input/50 rounded-lg p-4 border border-blue-600/20"
                                                                    >
                                                                        <p className="text-sm font-medium text-blue-300">@{s.account.acct}</p>
                                                                        <div dangerouslySetInnerHTML={{ __html: s.content }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {searchResults.accounts.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-green-400 mb-2">Accounts</h4>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {searchResults.accounts.slice(0, 6).map((a) => (
                                                                    <div
                                                                        key={a.id}
                                                                        className="flex items-center gap-3 p-3 bg-green-950/20 rounded-lg border border-green-600/30"
                                                                    >
                                                                        <img src={a.avatar} alt="" className="w-10 h-10 rounded-full" />
                                                                        <div>
                                                                            <p className="text-sm font-medium">{a.displayName}</p>
                                                                            <p className="text-xs text-muted-foreground">@{a.acct}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </DemoCard>
                                    )}
                                    {selectedHook === "useWhoToFollow" && (
                                        <DemoCard title="Who to Follow">
                                            <button
                                                onClick={() => triggerQuery("useWhoToFollow", refetchWhoToFollow)}
                                                className="mb-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm font-medium flex items-center gap-2"
                                            >
                                                <RefreshCw className="w-4 h-4" /> Refresh Suggestions
                                            </button>

                                            <div className="grid grid-cols-2 gap-4">
                                                {whoToFollow?.slice(0, 10).map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center gap-4 p-4 bg-input/50 rounded-xl border border-blue-600/20 hover:border-blue-500/50 transition"
                                                    >
                                                        <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{user.displayName}</p>
                                                        </div>
                                                        <button
                                                            disabled={followPending}
                                                            onClick={() =>
                                                                run(
                                                                    () => followUser({ accountId: user.id, follow: !user.following }),
                                                                    user.following ? "Unfollowed!" : "Followed!",
                                                                    user.following ? "Unfollowing..." : "Following..."
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${user.following
                                                                ? "bg-red-600/20 border-red-600/40 hover:bg-red-600/30 text-red-300"
                                                                : "bg-blue-600/20 border-blue-600/40 hover:bg-blue-600/30 text-blue-300"
                                                                }`}
                                                        >
                                                            {user.following ? "Unfollow" : "Follow"}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </DemoCard>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {/* Response Log */}
                    <div className="border-t border-blue-600/20 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm">
                        <div className="max-w-4xl mx-auto px-8 py-4">
                            <div className="bg-gradient-to-br from-card via-blue-950/20 to-card border border-blue-600/40 rounded-xl shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-card to-blue-950/10 border-b border-blue-600/30">
                                    <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm">
                                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                                        Response Log
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setLastOutput(null)
                                            toast.info("Response log cleared")
                                        }}
                                        className="text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-blue-600/10"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <pre className="p-4 bg-gradient-to-br from-input via-blue-950/30 to-input text-xs font-mono max-h-48 overflow-auto text-foreground">
                                    {lastOutput ? (
                                        <code className={lastOutput.success ? "text-green-400" : "text-red-400"}>
                                            {JSON.stringify(lastOutput, null, 2)}
                                        </code>
                                    ) : (
                                        <span className="text-muted-foreground">Click Trigger Now to see live API response!</span>
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
        <div className="bg-gradient-to-br from-card via-card to-blue-950/10 border border-blue-600/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                {title}
            </h3>
            {children}
        </div>
    )
}