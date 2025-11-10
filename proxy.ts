// proxy.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const protectedPaths = ["/profile", "/dashboard"];
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected && !token) {
        const signInUrl = new URL("/login", request.url);
        signInUrl.searchParams.set("callbackUrl", request.url);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// Optional: Improve performance — only run on specific routes
export const config = {
    matcher: ["/profile/:path*", "/dashboard/:path*"],
};