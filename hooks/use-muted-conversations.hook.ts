import { useQuery } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "./use-masto-client.hook";

// ✅ Extend the Conversation type with the missing `muted` field
interface ExtendedConversation extends mastodon.v1.Conversation {
    muted?: boolean;
}

export function useMutedConversations() {
    const mastoClient = useMastoClient();

    return useQuery({
        queryKey: ["muted-conversations"],
        queryFn: async (): Promise<ExtendedConversation[]> => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            const convos = (await mastoClient.v1.conversations.list()) as ExtendedConversation[];
            return convos.filter((c) => c.muted);
        },
        enabled: !!mastoClient,
    });
}
