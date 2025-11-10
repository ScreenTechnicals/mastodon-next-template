import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

export function useMutedUsers() {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["muted-users"],
        queryFn: async (): Promise<mastodon.v1.Account[]> => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.mutes.list();
        },
        enabled: !!mastoClient,
        staleTime: 60_000, // 1 minute
    });
}
