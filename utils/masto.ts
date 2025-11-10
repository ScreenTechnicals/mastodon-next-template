import { createRestAPIClient } from "masto";

export const mastoClient = createRestAPIClient({
    url: process.env.MASTO_INSTANCE!,
    accessToken: process.env.MASTO_ACCESS_TOKEN,
});

export const getMastoClient = (token: string | undefined) => createRestAPIClient({
    url: process.env.MASTO_INSTANCE!,
    accessToken: token,
});