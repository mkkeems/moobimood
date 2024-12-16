import { generateCSRFToken } from "@/utils/generateCSRFToken";
import queryString from "query-string";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { secret, csrfToken } = generateCSRFToken();

  const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    state: csrfToken,
    display: "popup",
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
  const previousPage = req.headers.get("referer") || "/";
  response.cookies.set("previousPage", previousPage, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
  });

  return response;
}
