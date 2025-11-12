import { useMastoClient } from "@/hooks/use-masto-client.hook"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export function useFollowUser() {
    const client = useMastoClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["follow-user"],
        mutationFn: async ({
            accountId,
            follow,
        }: {
            accountId: string
            follow: boolean
        }) => {
            const account = client.v1.accounts.$select(accountId)
            return follow ? await account.follow() : await account.unfollow()
        },
        onSuccess: (_, _variables) => {
            queryClient.invalidateQueries({ queryKey: ["who-to-follow"] })
            queryClient.invalidateQueries({ queryKey: ["useUserFollowing"] })
        },
        onError: (err) => {
            console.log(`Failed: ${err.message}`)
        },
    })
}
