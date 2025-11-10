## 🧩 Hooks Overview

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
