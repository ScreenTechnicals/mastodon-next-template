import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

export function usePostStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (status: string) => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return mastoClient.v1.statuses.create({ status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
        },
    });
}
