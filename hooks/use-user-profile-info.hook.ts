import { getMastoClient } from "@/utils/masto";
import { AccountCredentials } from "masto/mastodon/entities/v1/account.js";
import { useEffect, useState } from "react";
import { useUserSession } from "./use-user-session.hook";

export const useUserProfileInfo = () => {
    const { token, } = useUserSession()
    const [profile, setProfile] = useState<AccountCredentials | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const masto = getMastoClient(token);
                const me = await masto.v1.accounts.verifyCredentials();

                setProfile(me);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    return {
        ...profile,
        isLoading: loading
    }
}
