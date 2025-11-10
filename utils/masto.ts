import { envs } from "@/common/const/env.const";
import { createRestAPIClient, createStreamingAPIClient } from "masto";

export const mastoClient = createRestAPIClient({
    url: envs.instance,
    accessToken: envs.accessToken,
});

export const getMastoClient = (token: string | undefined) => createRestAPIClient({
    url: envs.instance,
    accessToken: token,
});


export const getStreamingMastoClient = (token: string | undefined) => createStreamingAPIClient({ accessToken: token, streamingApiUrl: "wss://mastodon.social/api/v1/streaming" });