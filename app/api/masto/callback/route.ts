import { createRestAPIClient } from 'masto';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

        const instance = process.env.MASTO_INSTANCE!;
        const clientId = process.env.MASTO_CLIENT_ID!;
        const clientSecret = process.env.MASTO_CLIENT_SECRET!;
        const redirectUri = process.env.MASTO_REDIRECT_URI!;

        const tokenRes = await fetch(`${instance}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code,
            }),
        });

        const debug = await tokenRes.text();
        console.log('🔍 OAuth token response:', debug);

        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'Token exchange failed', details: debug }, { status: 500 });
        }

        const tokenData = JSON.parse(debug);
        const masto = createRestAPIClient({ url: instance, accessToken: tokenData.access_token });
        const me = await masto.v1.accounts.verifyCredentials();

        const redirectUrl = new URL(
            `/profile?token=${tokenData.access_token}&username=${me.username}`,
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        );

        return NextResponse.redirect(redirectUrl);
    } catch (err: any) {
        console.error('💥 Callback error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
