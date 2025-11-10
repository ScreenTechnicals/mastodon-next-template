
# 🪝 Mastodon React Hooks

> **A fully-typed hook collection for Mastodon**, powered by [masto.js](https://github.com/neet/masto.js) and [TanStack React Query](https://tanstack.com/query).
> Designed for **Next.js + TypeScript**, these hooks simplify connecting to Mastodon APIs — from timelines to posting, liking, reblogging, and more.

---

## ⚙️ Features

* 🔒 OAuth & session-based authentication
* 🧠 Caching and background revalidation via React Query
* 🖼️ Media upload (images, GIFs, videos)
* 🔔 Realtime-style notifications
* ❤️ Favourite / 🔁 Reblog actions
* 🧩 Modular structure — ready for production or SDK publishing

---

## 📁 Folder Structure

```
hooks/
│
├─ mutations/
│  ├─ use-favourite-status.hook.ts
│  ├─ use-post-status.hook.ts
│  ├─ use-reblog-status.hook.ts
│  └─ use-toggle-favourite.hook.ts
│
├─ use-home-timeline.hook.ts
├─ use-masto-client.hook.ts
├─ use-notifications.hook.ts
├─ use-public-timeline.hook.ts
├─ use-user-followers.hook.ts
├─ use-user-following.hook.ts
├─ use-user-posts.hook.ts
├─ use-user-profile-info.hook.ts
└─ use-user-session.hook.ts
```

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```bash
npm install masto @tanstack/react-query
```

If using Next.js App Router, ensure you have React 18+ and Node 18+.

---

### 2️⃣ Setup React Query Provider

```tsx
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
            retry: 2,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

Wrap your layout:

```tsx
// app/layout.tsx
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 🔐 Authentication Setup

Use your existing OAuth flow to get an **access token**.
Then, store it in a user session or local storage, and load it via:

```ts
const { token } = useUserSession();
const masto = useMastoClient(token);
```

---

## 🧩 Hooks Overview

### 👤 `useUserProfileInfo`

Fetch authenticated user profile.

```ts
const { data: profile, isLoading } = useUserProfileInfo();
```

---

### 📝 `useUserPosts`

Fetch posts (statuses) by the authenticated user or any account.

```ts
const { data: posts } = useUserPosts({ accountId, limit: 10 });
```

---

### 🧑‍🤝‍🧑 `useUserFollowers` & `useUserFollowing`

Retrieve followers and following lists.

```ts
const { data: followers } = useFollowers();
const { data: following } = useFollowing();
```

---

### 🏠 `useHomeTimeline`

Get posts from followed users.

```ts
const { data: homeFeed } = useHomeTimeline(20);
```

---

### 🌐 `usePublicTimeline`

View public/federated posts.

```ts
const { data: publicFeed } = usePublicTimeline(20);
```

✅ For Mastodon v6+, uses:

```ts
masto.v1.timelines.public.list({ limit });
```

---

### 🔔 `useNotifications`

Fetch user notifications (mentions, boosts, likes).

```ts
const { data: notifications } = useNotifications();
```

Refreshes every 15 seconds.

---

## 💬 Mutations

All mutation hooks automatically refresh cached queries like `home-timeline` and `user-posts`.

---

### 🖊️ `usePostStatus`

Create a new post — with or without media (images, videos).

```ts
const { mutate: postStatus } = usePostStatus();

postStatus({
  status: "Hello from Mastodon! 🚀",
  files: [file], // optional image/video files
});
```

✅ Automatically waits for media processing before posting.

---

### ❤️ `useFavouriteStatus`

Like (favourite) a post.

```ts
const { mutate: favourite } = useFavouriteStatus();
favourite(statusId);
```

---

### 🔁 `useReblogStatus`

Reblog (boost) a post.

```ts
const { mutate: reblog } = useReblogStatus();
reblog(statusId);
```

---

### 💖 `useToggleFavourite`

Toggle favourite/unfavourite dynamically.

```ts
const { mutate: toggleFavourite } = useToggleFavourite();
toggleFavourite({ id: status.id, isFavourited: status.favourited });
```

---

## 🧱 Hook Behavior Summary

| Hook               | Type     | Cache | Auto Revalidate | Invalidate On Mutation |
| ------------------ | -------- | ----- | --------------- | ---------------------- |
| useUserProfileInfo | Query    | ✅     | 5m              | —                      |
| useUserPosts       | Query    | ✅     | 2m              | —                      |
| useFollowers       | Query    | ✅     | 2m              | —                      |
| useFollowing       | Query    | ✅     | 2m              | —                      |
| useHomeTimeline    | Query    | ✅     | 1m              | —                      |
| usePublicTimeline  | Query    | ✅     | 1m              | —                      |
| useNotifications   | Query    | ✅     | 15s             | —                      |
| usePostStatus      | Mutation | —     | —               | ✅                      |
| useFavouriteStatus | Mutation | —     | —               | ✅                      |
| useReblogStatus    | Mutation | —     | —               | ✅                      |
| useToggleFavourite | Mutation | —     | —               | ✅                      |

---

## 🧠 Example — Mini Mastodon Dashboard

```tsx
"use client";
import {
  useUserProfileInfo,
  useUserPosts,
  usePostStatus,
  useFavouriteStatus,
} from "@/hooks";

export default function Dashboard() {
  const { data: profile } = useUserProfileInfo();
  const { data: posts } = useUserPosts({ limit: 5 });
  const { mutate: postStatus } = usePostStatus();
  const { mutate: favourite } = useFavouriteStatus();

  if (!profile) return <p>Loading...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">@{profile.username}</h1>

      <button
        className="mt-4 bg-blue-600 text-white px-3 py-2 rounded"
        onClick={() =>
          postStatus({ status: "Posting from my Mastodon dashboard 🚀" })
        }
      >
        New Post
      </button>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
        {posts?.map((p) => (
          <div key={p.id} className="border p-3 mb-3 rounded">
            <div dangerouslySetInnerHTML={{ __html: p.content }} />
            <button
              className="text-pink-500 mt-2"
              onClick={() => favourite(p.id)}
            >
              ❤️ Like
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
```

---

## 🧩 Requirements

* **React 18+**
* **Next.js 13+ (App Router)**
* **masto.js v6+**
* **@tanstack/react-query v5+**
* Node.js 18+ runtime (for File API support)

---

## 🧾 Roadmap

✅ Current: Core hooks for timeline, posting, favourites, and reblogs
🧠 Next:

* `useBookmarkStatus()`
* `useUploadMedia()` (with progress tracking)
* `useStreamingTimeline()` (live WebSocket feed)
* `useHashtagTimeline(tag)`

---

## ✨ Credits

Developed by **Chinmaya Sa (Captain Buddy)** 🧑‍🚀
Frontend Developer & Web3 Engineer

**Tech Stack:** Next.js, TypeScript, TailwindCSS, Mastodon API, TanStack React Query

> *“Federate your frontend — one hook at a time.”* 🌐

---

Would you like me to include **GitHub-ready badges** (version, license, built-with, etc.) and a **banner section** for your README top (like “Mastodon Hooks ⚡ for Next.js”)?
It’ll make it look like a polished open-source project.
