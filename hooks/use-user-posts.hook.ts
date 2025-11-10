import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

export function useUserPosts(opts?: { accountId?: string; limit?: number }) {
    const { accountId, limit = 10 } = opts || {};
    const mastoClient = useMastoClient();

    return useQuery<mastodon.v1.Status[], Error>({
        queryKey: ["user-posts", accountId, limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");

            const id =
                accountId ??
                (await mastoClient.v1.accounts.verifyCredentials()).id;

            return mastoClient.v1.accounts.$select(id).statuses.list({
                limit,
            });
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 60 * 5, // ✅ cache for 5 min
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 2,
    });
}
