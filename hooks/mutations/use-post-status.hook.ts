import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

type PostStatusParams = {
    status: string;
    files?: File[];
};

export function usePostStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ status, files }: PostStatusParams) => {
            if (!mastoClient) throw new Error("Masto client not initialized");

            let mediaIds: string[] = [];

            // ✅ Step 1: Upload files if any
            if (files?.length) {
                const uploads = await Promise.all(
                    files.map(async (file) => {
                        const media = await mastoClient.v2.media.create({ file });
                        return media.id;
                    })
                );
                mediaIds = uploads;
            }

            // ✅ Step 2: Post status with media
            return mastoClient.v1.statuses.create({
                status,
                mediaIds: mediaIds.length ? mediaIds : undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
        },
    });
}
