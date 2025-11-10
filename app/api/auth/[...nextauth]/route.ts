/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMastoClient } from "@/utils/masto";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers/index";
import { UserSession, UserSessionUser } from './../../../../hooks/use-user-session.hook';


// Mastodon Profile Shape
type MastodonProfile = {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
    avatar_static: string;
}

// One-file Mastodon Provider
const MastodonProvider = (instance: string) => ({
    id: "mastodon",
    name: "Mastodon",
    type: "oauth",
    version: "2.0",
    authorization: {
        url: `${instance}/oauth/authorize`,
        params: { scope: "read write follow" },
    },
    token: `${instance}/oauth/token`,
    userinfo: {
        url: `${instance}/api/v1/accounts/verify_credentials`,
        async request({ tokens }: { tokens: any }) {
            const masto = getMastoClient(
                tokens.access_token as string,
            );

            const account = await masto.v1.accounts.verifyCredentials();

            return {
                id: account.id,
                username: account.username,
                display_name: account.displayName ?? account.username,
                avatar: account.avatar,
                avatar_static: account.avatarStatic,
            } as MastodonProfile;
        },
    },
    profile(profile: MastodonProfile) {
        return {
            id: profile.id,
            name: profile.display_name.trim() || profile.username,
            email: null,
            image: profile.avatar_static,
            username: profile.username,
        };
    },
    clientId: process.env.MASTO_CLIENT_ID!,
    clientSecret: process.env.MASTO_CLIENT_SECRET!,
    checks: ["pkce", "state"],
});

const handler = NextAuth({
    providers: [
        MastodonProvider(process.env.MASTO_INSTANCE!) as Provider, // e.g. https://mastodon.social
    ],
    session: {
        strategy: "jwt", // ✅ explicitly set
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                token.username = (profile as any)?.username;
            }
            return token;
        },
        async session({ session, token }) {
            (session as UserSession).accessToken = token.accessToken as string;
            (session?.user as UserSessionUser).username = token.username as string;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
