import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useTrendingTags(limit = 10) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["trending-tags", limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.trends.tags.list({ limit });
        },
        enabled: !!mastoClient,
    });
}
