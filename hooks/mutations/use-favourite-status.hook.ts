import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

export function useFavouriteStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (statusId: string) => {
            if (!mastoClient) throw new Error("Masto client not initialized");
            return await mastoClient.v1.statuses.$select(statusId).favourite();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
        },
    });
}
