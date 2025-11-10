## 🧩 Hooks Overview

| Hook                            | Type     | Description                                                                              |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| **useMastoClient**              | Utility  | Creates and manages the authenticated Masto.js REST client using the user’s token.       |
| **useUserSession**              | Utility  | Provides the user’s Mastodon access token (from local/session storage or cookie).        |
| **useUserProfileInfo**          | Query    | Fetches the authenticated user’s profile info (username, avatar, followers count, etc.). |
| **useUserPosts**                | Query    | Lists posts made by the authenticated user (or another account).                         |
| **useUserFollowers**            | Query    | Fetches the list of followers for a given user.                                          |
| **useUserFollowing**            | Query    | Fetches the list of accounts the user is following.                                      |
| **useHomeTimeline**             | Query    | Retrieves posts from users the account follows (the user’s home feed).                   |
| **usePublicTimeline**           | Query    | Fetches public posts visible to everyone on the instance.                                |
| **useHashtagTimeline**          | Query    | Retrieves posts under a specific hashtag (e.g. `#NextJS`).                               |
| **useNotifications**            | Query    | Fetches user notifications (mentions, favourites, boosts, follows).                      |
| **usePostStatus**               | Mutation | Creates a new Mastodon post (status), with optional media attachments.                   |
| **useReplyToStatus**            | Mutation | Replies to an existing post using its `inReplyToId`.                                     |
| **useFavouriteStatus**          | Mutation | Favourites (likes) a specific post.                                                      |
| **useReblogStatus**             | Mutation | Boosts (reblogs) a post to the user’s followers.                                         |
| **useBookmarkStatus**           | Mutation | Adds a post to the user’s bookmarks.                                                     |
| **useToggleFavourite**          | Mutation | Toggles favourite/unfavourite on a post dynamically.                                     |
| **useUploadMedia**              | Mutation | Uploads media files (image/video) with progress tracking, returning `mediaIds`.          |
| **useStreamingTimeline**        | Stream   | Real-time updates for public, home, or local timelines via WebSocket streaming.          |
| **useStreamingHashtagTimeline** | Stream   | Streams live posts for a specific hashtag (e.g., `#Web3`, `#NextJS`).                    |

---
