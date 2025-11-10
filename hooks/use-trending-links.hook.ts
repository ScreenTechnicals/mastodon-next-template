import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useTrendingLinks(limit = 10) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["trending-links", limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.trends.links.list({ limit });
        },
        enabled: !!mastoClient,
    });
}
