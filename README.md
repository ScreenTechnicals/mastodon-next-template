# 🧩 Mastodon Next Template - The Interactive Mastodon Hook Playground

> mastodon-next-template is an open-source, interactive playground built with **Next.js + Tailwind CSS**, designed to explore, test, and visualize **Mastodon API React hooks** in real time.
> It provides a modern, developer-friendly interface to trigger queries, run mutations, and watch streaming events — all without touching the terminal.

---

## 🚀 Features

* 🎛️ **Interactive Hook Dashboard** – Browse, search, and test all Mastodon hooks
* ⚡ **Real-time Streaming Feed** – See live updates from the public timeline
* 🧠 **Response Logs** – Every query and mutation response is logged neatly
* ❤️ **Mutations Playground** – Instantly post, like, reblog, or bookmark
* 🔕 **Moderation Filters** – Add or view muted words and users
* 🌈 **Modern UI** – Gradient-rich layout, responsive design, and accessible controls
* 🔔 **Toasts for Feedback** – Live notifications for success, errors, and copy actions

---

## 🏗️ Tech Stack

| Layer             | Technology                                       |
| :---------------- | :----------------------------------------------- |
| **Frontend**      | Next.js 14, React 18, TypeScript                 |
| **Styling**       | Tailwind CSS, shadcn/ui                          |
| **Icons**         | lucide-react                                     |
| **Notifications** | react-hot-toast                                  |
| **API Layer**     | Mastodon SDK hooks (custom React Query wrappers) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── test-hooks/             # Main page
│   └── layout.tsx              # App layout
├── hooks/
│   ├── use-home-timeline.hook.ts
│   ├── use-trending-tags.hook.ts
│   ├── mutations/
│   │   ├── use-post-status.hook.ts
│   │   ├── use-bookmark-status.hook.ts
│   │   └── use-favourite-status.hook.ts
│   └── ... (more)
└── components/
    ├── ui/
    ├── toast-provider.tsx
    └── ...
```

---

## ⚙️ Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ScreenTechnicals/mastodon-next-template
cd mastodon-next-template
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3️⃣ Configure Environment

Create a `.env.local` file and add your Mastodon credentials:

```bash
NEXT_PUBLIC_MASTODON_BASE_URL=https://mastodon.social
NEXT_PUBLIC_MASTODON_ACCESS_TOKEN=your_access_token_here
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open your browser at
👉 **[http://localhost:3000/test-hooks](http://localhost:3000/test-hooks)**

---

## 🧪 How to Use

1. **Log in** with your Mastodon instance credentials.
2. **Browse hooks** from the sidebar (query, mutation, stream, etc.).
3. **Trigger live queries** like `useTrendingTags` or `useUserProfileInfo`.
4. **Test mutations** like `usePostStatus`, `useFavouriteStatus`, etc.
5. **Check the Response Log** at the bottom for real API data.
6. Copy post IDs or mute keywords using the built-in actions.

---

## 🧑‍💻 Contribution Guidelines

mastodon-next-template is open for collaboration! Follow these steps to contribute:

1. **Fork** the repo
2. Create a **new branch**:

   ```bash
   git checkout -b feat/new-hook
   ```

3. Make your changes and commit with clear messages

   ```bash
   git commit -m "feat: added hook for useNotifications"
   ```

4. Push your branch and open a **Pull Request**

### Code Style

* Use **kebab-case** for file names (e.g., `use-user-info.hook.ts`)
* Write TypeScript types/interfaces properly
* Keep UI components **reusable and composable**

---

## 🧱 Available Hooks

| Hook                      | Type     | Description                                                                                         |
| ------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| **useMastoClient**        | Utility  | Creates and manages the authenticated `masto` REST client using the user’s token.                   |
| **useUserSession**        | Utility  | Provides and manages the current user’s Mastodon access token (from cookies, storage, etc.).        |
| **useUserProfileInfo**    | Query    | Fetches the authenticated user’s profile details like username, display name, avatar, and counts.   |
| **useUserPosts**          | Query    | Lists posts created by the authenticated user or another specified account.                         |
| **useUserFollowers**      | Query    | Fetches all followers of the authenticated user or another account.                                 |
| **useUserFollowing**      | Query    | Fetches all accounts followed by the authenticated user.                                            |
| **useHomeTimeline**       | Query    | Retrieves the user’s home timeline (posts from followed accounts).                                  |
| **usePublicTimeline**     | Query    | Fetches the global public timeline (all visible public posts).                                      |
| **useHashtagTimeline**    | Query    | Retrieves posts associated with a specific hashtag (e.g., `#NextJS`).                               |
| **useNotifications**      | Query    | Fetches user notifications such as mentions, boosts, and favourites.                                |
| **usePrivateMentions**    | Query    | Lists private mentions (direct messages) using the `/conversations` API.                            |
| **useMutedUsers**         | Query    | Fetches all users currently muted by the authenticated account.                                     |
| **useMutedWords**         | Query    | Lists muted keywords and filters configured by the user.                                            |
| **useMutedDomains**       | Query    | Fetches all blocked or muted domains.                                                               |
| **useMutedConversations** | Query    | Lists muted private conversation threads.                                                           |
| **useTrendingPosts**      | Query    | Fetches currently trending posts (statuses).                                                        |
| **useTrendingTags**       | Query    | Fetches trending hashtags.                                                                          |
| **useTrendingLinks**      | Query    | Fetches trending shared links.                                                                      |
| **useStreamingTimeline**  | Stream   | Subscribes to live timelines (`home`, `public`, or `local`) via Mastodon’s WebSocket streaming API. |
| **usePostStatus**         | Mutation | Creates a new post (status) with optional media attachments.                                        |
| **useReplyStatus**        | Mutation | Replies to an existing post using `inReplyToId`.                                                    |
| **useFavouriteStatus**    | Mutation | Favourites (likes) a specific post.                                                                 |
| **useReblogStatus**       | Mutation | Boosts (reblogs) a post to the user’s followers.                                                    |
| **useBookmarkStatus**     | Mutation | Adds or removes a post from the user’s bookmarks.                                                   |
| **useToggleFavourite**    | Mutation | Toggles a post’s favourite/unfavourite state dynamically.                                           |
| **useUploadMedia**        | Mutation | Uploads image or video files with progress tracking and returns `mediaIds` for attaching to posts.  |
| **useMuteActions**        | Mutation | Provides moderation actions — mute/unmute users, add/remove muted words (filters).                  |

---

### ✅ Grouped by Purpose

| Category                     | Hooks                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| **Authentication & Client**  | `useUserSession`, `useMastoClient`                                                             |
| **User Info & Relations**    | `useUserProfileInfo`, `useUserFollowers`, `useUserFollowing`, `useUserPosts`                   |
| **Timelines**                | `useHomeTimeline`, `usePublicTimeline`, `useHashtagTimeline`, `useStreamingTimeline`           |
| **Posting & Media**          | `usePostStatus`, `useUploadMedia`, `useReplyStatus`                                            |
| **Interactions**             | `useFavouriteStatus`, `useToggleFavourite`, `useReblogStatus`, `useBookmarkStatus`             |
| **Notifications & Mentions** | `useNotifications`, `usePrivateMentions`                                                       |
| **Trending Content**         | `useTrendingPosts`, `useTrendingTags`, `useTrendingLinks`                                      |
| **Moderation & Filters**     | `useMutedUsers`, `useMutedWords`, `useMutedDomains`, `useMutedConversations`, `useMuteActions` |

---

## 🪄 Toast Feedback Examples

| Action           | Toast Message                          |
| ---------------- | -------------------------------------- |
| Query Started    | “Fetching useHomeTimeline…”            |
| Query Success    | “useHomeTimeline loaded successfully!” |
| Mutation Success | “Action successful!”                   |
| Copy ID          | “Copied to clipboard!”                 |
| Error            | “Something went wrong”                 |

---

## 🧰 Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Run the Next.js app in dev mode |
| `npm run build` | Build for production            |
| `npm run start` | Start the production server     |
| `npm run lint`  | Check for linting issues        |

---

## 🌍 Deployment

You can deploy mastodon-next-template easily using:

* **Vercel** (recommended)
* **Netlify**
* **Docker**

### Example (Vercel)

```bash
vercel --prod
```

---

## 📜 License

**MIT License** © 2025 [Your Name / Chinmaya Sa]
Feel free to use, modify, and contribute to mastodon-next-template under the open-source MIT terms.

---

## 🌟 Support

If you like this project:

* ⭐ Star the repository
* 🐦 Share it with your developer friends
* 💬 Contribute new hooks or ideas

---

Would you like me to tailor this README to fit your **organization (like NeoBase Labs / Dev Verse)** branding style — with logo, tagline, and contributor badge section?
