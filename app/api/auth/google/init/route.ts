import { generateCSRFToken } from "@/utils/generateCSRFToken";
import queryString from "query-string";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nextPath = searchParams.get("nextPath");
  console.log({ searchParams, nextPath });

  const { secret, csrfToken } = generateCSRFToken();
  console.log("googleClientId", process.env.GOOGLE_CLIENT_ID);

  const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    response_type: "code",
    scope: ["openid", "profile", "email"].join(" "),
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    state: csrfToken,
  };

  const redirectUrl = `${googleOAuthURL}?${queryString.stringify(options)}`;

  console.log("redirectUrl", redirectUrl);

  const response = NextResponse.json({ redirectUrl });
  response.cookies.set("csrfSecret", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
  });

  return response;
}
