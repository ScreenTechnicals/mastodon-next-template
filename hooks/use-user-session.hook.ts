"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export type UserSession = Session & { accessToken?: string, username?: string };

export const useUserSession = () => {
    const { data: session, status, update } = useSession();
    const isAuthenticated = status === "authenticated"
    const isLoading = status === "loading"



    return {
        token: (session as UserSession)?.accessToken,
        name: session?.user?.name,
        username: (session?.user as UserSession)?.username,
        image: session?.user?.image,
        authStatus: status,
        updateSession: update,
        isAuthenticated,
        isLoading
    }
}
