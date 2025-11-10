import { AccountCredentials } from "masto/mastodon/entities/v1/account.js";
import { useEffect, useState } from "react";
import { useMastoClient } from "./use-masto-client.hook";

export const useUserProfileInfo = () => {
    const mastoClient = useMastoClient()
    const [profile, setProfile] = useState<AccountCredentials | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!mastoClient || profile) return;

        const fetchProfile = async () => {
            try {
                const me = await mastoClient.v1.accounts.verifyCredentials();

                setProfile(me);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [mastoClient, profile]);

    return {
        ...profile,
        isLoading: loading
    }
}
