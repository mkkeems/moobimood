import { type NextRequest, NextResponse } from "next/server";
import { refreshTokensAction } from "./actions/tokens/refreshTokensAction";
import { decrypt } from "./actions/tokens/tokenUtils";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname === "/api/me"
  ) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      const payload = await decrypt(accessToken);

      if (payload) {
        return NextResponse.next();
      }
    }

    const refreshResult = await refreshTokensAction();

    if (refreshResult.success) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/me"],
};
