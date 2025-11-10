import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";
import { useUserProfileInfo } from "./use-user-profile-info.hook";

export function useUserFollowers(limit = 20) {
    const mastoClient = useMastoClient();
    const { data: profile } = useUserProfileInfo();

    return useQuery({
        queryKey: ["followers", profile?.id, limit],
        queryFn: async () => {
            if (!mastoClient || !profile?.id)
                throw new Error("Masto client or profile not ready");

            return mastoClient.v1.accounts.$select(profile.id).followers.list({ limit });
        },
        enabled: !!mastoClient && !!profile?.id,
        staleTime: 1000 * 60 * 2,
    });
}
