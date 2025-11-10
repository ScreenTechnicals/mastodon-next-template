import { createRestAPIClient } from "masto";

export const mastoClient = createRestAPIClient({
    url: "https://mastodon.social",
    accessToken: "11ypFJNnKR-WBlIghVRaV3c7-3HwePvo1PxUpO9N7YQ",
});
