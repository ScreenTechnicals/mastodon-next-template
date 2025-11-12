import { useMastoClient } from "@/hooks/use-masto-client.hook"
import { useQuery } from "@tanstack/react-query"
import type { mastodon } from "masto"

interface SearchResult {
    accounts: mastodon.v1.Account[]
    statuses: mastodon.v1.Status[]
    hashtags: mastodon.v1.Tag[]
}

export function useSearchOrUrl(query: string) {
    const client = useMastoClient()

    return useQuery<SearchResult>({
        queryKey: ["search-or-url", query],
        enabled: !!query && query.trim().length > 1,
        queryFn: async () => {
            if (!client) throw new Error("Masto client not initialized")

            // ✅ Correct usage in Mastodon SDK v6+
            const res = await client.v2.search.list({
                q: query,
                resolve: true,
                limit: 10,
            })

            return {
                accounts: res.accounts ?? [],
                statuses: res.statuses ?? [],
                hashtags: res.hashtags ?? [],
            }
        },
    })
}
