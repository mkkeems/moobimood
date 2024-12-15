import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./actions/tokens/tokenUtils";
import { refreshTokensAction } from "./actions/tokens/refreshTokensAction";

export async function middleware(request: NextRequest) {
  console.log("we in the middleware now baby");
  console.log("da cookies", request.cookies);
  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken) {
    console.log("accessToken is alighhht");
    const payload = await decrypt(accessToken);

    console.log("accessToken payload", payload);
    if (payload) {
      return NextResponse.next();
    }
  }

  const refreshResult = await refreshTokensAction();
  if (refreshResult.success) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/profile", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
