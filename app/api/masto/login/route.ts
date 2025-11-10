import { NextResponse } from 'next/server';

export async function GET() {
    const instance = process.env.MASTO_INSTANCE!;
    const clientId = process.env.MASTO_CLIENT_ID!;
    const redirectUri = process.env.MASTO_REDIRECT_URI!;
    const scopes = 'read write follow';

    const url = `${instance}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    return NextResponse.json({ url });
}
