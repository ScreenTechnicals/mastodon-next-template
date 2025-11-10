import { envs } from "@/common/const/env.const";
import { createRestAPIClient } from "masto";

export const mastoClient = createRestAPIClient({
    url: envs.instance,
    accessToken: envs.accessToken,
});

export const getMastoClient = (token: string | undefined) => createRestAPIClient({
    url: envs.instance,
    accessToken: token,
});