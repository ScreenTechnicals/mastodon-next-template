import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

export function useToggleFavourite() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { id: string; isFavourited: boolean }) => {
            if (!mastoClient) throw new Error("Masto client not initialized");

            const { id, isFavourited } = params;

            return isFavourited
                ? mastoClient.v1.statuses.$select(id).unfavourite()
                : mastoClient.v1.statuses.$select(id).favourite();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
        },
    });
}
