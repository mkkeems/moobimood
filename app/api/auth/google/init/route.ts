import { generateCSRFToken } from "@/utils/generateCSRFToken";
import queryString from "query-string";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { secret, csrfToken } = generateCSRFToken();

  const response = NextResponse.json({
    message: "Redirecting to Google OAuth",
  });
  response.cookies.set("csrfSecret", secret, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 300,
  });

  const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
    state: csrfToken,
    display: "popup",
  };

  const url = `${googleOAuthURL}?${queryString.stringify(options)}`;

  console.log(url);

  return NextResponse.redirect(url);
}
