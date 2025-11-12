// hooks/use-who-to-follow.hook.ts
import { useMastoClient } from "@/hooks/use-masto-client.hook"
import { useQuery } from "@tanstack/react-query"

export function useWhoToFollow() {
    const mastoClient = useMastoClient()

    return useQuery({
        queryKey: ["who-to-follow"],
        queryFn: async () => {
            const res = await mastoClient.v1.suggestions.list({ limit: 10 })
            return res
        },
    })
}
