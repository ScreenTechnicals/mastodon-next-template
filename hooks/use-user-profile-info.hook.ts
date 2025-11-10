import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

export const useUserProfileInfo = () => {
    const mastoClient = useMastoClient();

    return useQuery<mastodon.v1.AccountCredentials>({
        queryKey: ["user-profile"],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.accounts.verifyCredentials();
        },
        enabled: !!mastoClient,
        staleTime: 1000 * 60 * 5, // ✅ cache profile for 5 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 2,
    });
};
