import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useMutedWords() {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["muted-words"],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v2.filters.list();
        },
        enabled: !!mastoClient,
    });
}
