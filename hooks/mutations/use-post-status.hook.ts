import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMastoClient } from "../use-masto-client.hook";

type PostStatusParams = {
    status: string;
    files?: File[]; // optional images/videos
    sensitive?: boolean;
    spoilerText?: string;
};

export function usePostStatus() {
    const mastoClient = useMastoClient();
    const queryClient = useQueryClient();

    const waitForMediaReady = async (mediaId: string) => {
        if (!mastoClient) throw new Error("Masto client not initialized");
        let media = await mastoClient.v1.media.$select(mediaId).fetch();

        // Some servers take time to process videos
        while (!media.url) {
            await new Promise((r) => setTimeout(r, 1500)); // wait 1.5s
            media = await mastoClient.v1.media.$select(mediaId).fetch();
        }

        return media;
    };

    return useMutation({
        mutationFn: async ({ status, files, sensitive, spoilerText }: PostStatusParams) => {
            if (!mastoClient) throw new Error("Masto client not initialized");

            let mediaIds: string[] = [];

            // ✅ 1️⃣ Upload media (images or videos)
            if (files?.length) {
                const uploads = await Promise.all(
                    files.map(async (file) => {
                        // Optional: pre-validate file size (e.g. 40MB max)
                        if (file.size > 40 * 1024 * 1024) {
                            throw new Error(`File ${file.name} is too large (max 40MB)`);
                        }

                        // Upload to Mastodon
                        const uploaded = await mastoClient.v2.media.create({
                            file,
                            description: file.name, // Optional alt text
                        });

                        // Wait for processing
                        const ready = await waitForMediaReady(uploaded.id);
                        return ready.id;
                    })
                );

                mediaIds = uploads;
            }

            // ✅ 2️⃣ Post the status with optional media
            const newStatus = await mastoClient.v1.statuses.create({
                status,
                mediaIds: mediaIds.length ? mediaIds : undefined,
                sensitive: sensitive ?? false,
                spoilerText: spoilerText ?? undefined,
            });

            return newStatus;
        },

        // ✅ 3️⃣ On success → revalidate queries
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-posts"] });
            queryClient.invalidateQueries({ queryKey: ["home-timeline"] });
        },
    });
}
