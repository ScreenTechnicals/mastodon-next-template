import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function usePublicTimeline(limit = 20) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["public-timeline", limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return await mastoClient.v1.timelines.public.list({
                limit,
            });
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 60 * 1,
    });
}
