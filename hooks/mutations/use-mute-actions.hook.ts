import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { mastodon } from "masto";
import { useMastoClient } from "../use-masto-client.hook";

/**
 * 🔇 Mute a user
 */
export function useMuteUser() {
    const masto = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (accountId: string) => {
            if (!masto) throw new Error("Not authenticated");
            return masto.v1.accounts.$select(accountId).mute();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["muted-users"] });
        },
    });
}

/**
 * 🔊 Unmute a user
 */
export function useUnmuteUser() {
    const masto = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (accountId: string) => {
            if (!masto) throw new Error("Not authenticated");
            return masto.v1.accounts.$select(accountId).unmute();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["muted-users"] });
        },
    });
}

/**
 * 🧠 Add a muted word (filter)
 */
export function useAddMutedWord() {
    const masto = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            phrase,
            context = ["home", "public", "notifications"],
        }: {
            phrase: string;
            context?: mastodon.v2.FilterContext[];
        }) => {
            if (!masto) throw new Error("Not authenticated");

            return masto.v2.filters.create({
                title: phrase,
                context,
                filterAction: "hide", // or "warn"
                expiresIn: null,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["muted-words"] });
        },
    });
}

/**
 * ❌ Remove a muted word
 */
export function useRemoveMutedWord() {
    const masto = useMastoClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (filterId: string) => {
            if (!masto) throw new Error("Not authenticated");
            return masto.v2.filters.$select(filterId).remove();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["muted-words"] });
        },
    });
}
