import { config } from "@/config";
import { generateCSRFToken } from "@/utils/generateCSRFToken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import queryString from "query-string";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const nextPath = searchParams.get("nextPath");

  const { secret, csrfToken } = generateCSRFToken();

  const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: config.GOOGLE_CLIENT_ID,
    response_type: "code",
    scope: ["openid", "profile", "email"].join(" "),
    redirect_uri: config.GOOGLE_REDIRECT_URI,
    state: csrfToken,
  };

  const redirectUrl = `${googleOAuthURL}?${queryString.stringify(options)}`;

  const response = NextResponse.json({ redirectUrl });
  response.cookies.set("csrfSecret", secret, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
  });

  /**
   * TODO:
   * - currently just grabbing previous page from req.referer
   * - but implement a history stack tracker hook or something
   * - to keep track of previous pages, limit to 2? 5? idkyetlol
   * - navigate user back to the previous page after login success
   */
  const previousPage = nextPath || req.headers.get("referer") || "/";

  response.cookies.set("previousPage", previousPage, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
  });

  return response;
}
