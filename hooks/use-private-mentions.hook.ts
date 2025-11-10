import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

export function usePrivateMentions() {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["private-mentions"],
        queryFn: async (): Promise<mastodon.v1.Conversation[]> => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.conversations.list();
        },
        enabled: !!mastoClient,
        staleTime: 30 * 1000, // refresh every 30s
    });
}
