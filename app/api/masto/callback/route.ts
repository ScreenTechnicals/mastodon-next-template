import { envs } from '@/common/const/env.const';
import { getMastoClient } from '@/utils/masto';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });


        const tokenRes = await fetch(`${envs.instance}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: envs.clientId,
                client_secret: envs.clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: envs.redirectUri,
                code,
            }),
        });

        const debug = await tokenRes.text();
        console.log('🔍 OAuth token response:', debug);

        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'Token exchange failed', details: debug }, { status: 500 });
        }

        const tokenData = JSON.parse(debug);
        const masto = getMastoClient(tokenData.access_token);
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
