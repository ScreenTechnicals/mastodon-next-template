import { mastoClient } from "@/utils/masto";
import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";

// Custom Mastodon provider config
const MastodonProvider = (instance: string): OAuthConfig<any> => ({
    id: "mastodon",
    name: "Mastodon",
    type: "oauth",
    version: "2.0",
    authorization: `${instance}/oauth/authorize?scope=read+write+follow`,
    token: `${instance}/oauth/token`,
    userinfo: {
        url: `${instance}/api/v1/accounts/verify_credentials`,
        async request({ tokens, provider }) {
            const me = await mastoClient.v1.accounts.verifyCredentials();
            return me;
        },
    },
    profile(profile) {
        return {
            id: profile.id,
            name: profile.display_name || profile.username,
            username: profile.username,
            image: profile.avatar,
        };
    },
    clientId: process.env.MASTO_CLIENT_ID!,
    clientSecret: process.env.MASTO_CLIENT_SECRET!,
    redirectUri: process.env.MASTO_REDIRECT_URI!,
});

const handler = NextAuth({
    providers: [
        MastodonProvider(process.env.MASTO_INSTANCE!),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.username = profile?.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.username = token.username;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
