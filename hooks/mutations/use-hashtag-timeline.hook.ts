import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";


export function useHashtagTimeline(tag: string, limit = 20) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["hashtag-timeline", tag, limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.timelines.tag.$select(tag).list({ limit });
        },
        enabled: !!mastoClient && !!tag,
        staleTime: 1000 * 60 * 2,
    });
}
