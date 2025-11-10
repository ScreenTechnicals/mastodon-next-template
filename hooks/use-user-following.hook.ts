import { useQuery } from "@tanstack/react-query";
import { useMastoClient } from "./use-masto-client.hook";
import { useUserProfileInfo } from "./use-user-profile-info.hook";


export function useUserFollowing(limit = 20) {
    const mastoClient = useMastoClient();
    const { data: profile } = useUserProfileInfo();

    return useQuery({
        queryKey: ["following", profile?.id, limit],
        queryFn: async () => {
            if (!mastoClient || !profile?.id)
                throw new Error("Masto client or profile not ready");

            return mastoClient.v1.accounts.$select(profile.id).following.list({ limit });
        },
        enabled: !!mastoClient && !!profile?.id,
        staleTime: 1000 * 60 * 2,
    });
}

