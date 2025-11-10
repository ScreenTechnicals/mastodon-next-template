import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

/**
 * Fetch trending posts (statuses)
 */
export function useTrendingPosts(limit = 10) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["trending-posts", limit],
        queryFn: async (): Promise<mastodon.v1.Status[]> => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            const statuses = await mastoClient.v1.trends.statuses.list({ limit });
            return statuses;
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 60, // 1 min cache
    });
}
