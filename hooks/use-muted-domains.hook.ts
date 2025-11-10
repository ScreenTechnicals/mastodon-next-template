import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";

export function useMutedDomains() {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["muted-domains"],
        queryFn: async () => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.domainBlocks.list();
        },
        enabled: !!mastoClient,
    });
}
