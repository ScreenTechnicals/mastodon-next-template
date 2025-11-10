import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useNotifications(limit = 20) {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["notifications", limit],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.notifications.list({ limit });
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 30, // refresh often
        refetchInterval: 1000 * 15, // auto-refresh every 15s
    });
}
