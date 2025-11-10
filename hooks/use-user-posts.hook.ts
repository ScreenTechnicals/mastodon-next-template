import type { mastodon } from "masto";
import { useEffect, useState } from "react";
import { useMastoClient } from "./use-masto-client.hook";

export function useUserPosts(opts?: { accountId?: string; limit?: number }) {
    const { accountId, limit = 10 } = opts || {};
    const mastoClient = useMastoClient();

    const [posts, setPosts] = useState<mastodon.v1.Status[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!mastoClient) return;
        let alive = true;

        (async () => {
            setLoading(true);
            try {
                const id = accountId ?? (await mastoClient.v1.accounts.verifyCredentials()).id;
                const res = await mastoClient.v1.accounts.$select(id).statuses.list({ limit });
                if (alive) setPosts(res);
            } catch (err) {
                if (alive) setError(err);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [mastoClient, accountId, limit]);

    return { posts, isLoading, error };
}
