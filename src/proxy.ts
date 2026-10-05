import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

/**
 * Gate for everything under /studio (and its API routes). Runs on the
 * Edge runtime, so it only verifies the signed session JWT — no database
 * access here (see src/lib/auth.ts for why the session carries identity
 * directly). Unauthenticated requests are redirected to /studio/login;
 * unauthenticated API calls get a 401 instead of a redirect.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/studio/login";
  const isAuthApi = pathname.startsWith("/api/studio/auth/");

  if (isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/studio")) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    const loginUrl = new URL("/studio/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};
