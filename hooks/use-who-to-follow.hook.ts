import { useMastoClient } from "@/hooks/use-masto-client.hook"
import { useQuery } from "@tanstack/react-query"
import type { mastodon } from "masto"

type SuggestedAccount = mastodon.v1.Account & { following?: boolean }

export function useWhoToFollow() {
    const client = useMastoClient()

    return useQuery<SuggestedAccount[]>({
        queryKey: ["who-to-follow"],
        enabled: !!client,
        queryFn: async () => {
            if (!client) throw new Error("Masto client not initialized")

            const suggestions = await client.v2.suggestions.list({ limit: 10 })
            const accounts = suggestions.map((s) => s.account)

            if (accounts.length === 0) return []

            const relationships = await client.v1.accounts.relationships.fetch({
                id: accounts.map((a) => a.id),
            })

            const accountsWithStatus = accounts.map((acc) => ({
                ...acc,
                following:
                    relationships.find((r) => r.id === acc.id)?.following ?? false,
            }))

            return accountsWithStatus
        },
    })
}
