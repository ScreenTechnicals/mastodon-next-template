import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useHomeTimeline(limit = 20) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["home-timeline", limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.timelines.home.list({ limit });
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 60 * 1,
    });
}
