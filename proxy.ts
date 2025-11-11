import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const protectedPaths = ["/profile", "/test-hooks"];
    const authPaths = ["/login"];
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );
    const isAuthPage = authPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected && !token) {
        const signInUrl = new URL("/login", request.url);
        return NextResponse.redirect(signInUrl);
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/test-hooks", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/test-hooks/:path*",
        "/login",
    ],
};
