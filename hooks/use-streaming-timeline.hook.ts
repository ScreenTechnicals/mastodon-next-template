import { getStreamingMastoClient } from "@/utils/masto";
import { type mastodon } from "masto";
import { useEffect, useState } from "react";
import { useUserSession } from "./use-user-session.hook";

/**
 * useStreamingTimeline — stream live Mastodon statuses.
 * Supports "public", "public-media", "public-local", and "home".
 */
export function useStreamingTimeline(
    kind: "public" | "public-media" | "public-local" | "home" = "public"
) {
    const { token } = useUserSession();
    const [events, setEvents] = useState<mastodon.v1.Status[]>([]);

    useEffect(() => {
        if (!token) return;

        const streaming = getStreamingMastoClient(token);

        let stopped = false;
        let sub: mastodon.streaming.Subscription | undefined;

        (async () => {
            if (kind === "home") {
                sub = await streaming.user.subscribe();
            } else if (kind === "public-media") {
                sub = await streaming.public.media.subscribe();
            } else if (kind === "public-local") {
                sub = await streaming.public.local.subscribe();
            } else {
                sub = await streaming.public.subscribe();
            }

            // ✅ Iterate over events
            for await (const ev of sub.values()) {
                if (stopped) break;

                switch (ev.event) {
                    case "update": {
                        const status = ev.payload as mastodon.v1.Status;
                        setEvents((prev) => [status, ...prev]);
                        break;
                    }
                    case "delete": {
                        const id = ev.payload as string;
                        setEvents((prev) => prev.filter((s) => s.id !== id));
                        break;
                    }
                    case "notification":
                        console.log("🔔 New notification", ev.payload);
                        break;
                    default:
                        console.debug("⚙️ Other event:", ev.event);
                }
            }
        })();

        return () => {
            stopped = true;
            sub?.unsubscribe();
            streaming.close();
        };
    }, [token, kind]);

    return { events };
}
