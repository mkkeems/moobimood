import { NextRequest, NextResponse } from "next/server";
import csrf from "csrf";

const tokens = new csrf();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const csrfSecret = req.cookies.get("csrfSecret");

  if (!csrfSecret || !state || !tokens.verify(csrfSecret.value, state)) {
    console.error("CSRF Verification Failed");
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 401 });
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const tokenData = await tokenResponse.json();
    console.log({ tokenData });

    const previousPage = req.cookies.get("previousPage")?.value || "/";

    const redirectUrl = new URL(previousPage, req.nextUrl.origin);

    const response = NextResponse.redirect(redirectUrl);

    /**
     * TODO:
     * - get user info from google with tokenData.access_token
     * - check if user already exists in the db
     * - if not, create a new user
     *    - navigate back to signup page
     *      - if googleAuth success, "add username" form
     *          => on submit, create user
     * - create user sessions
     * - redirect to the previous page
     */

    // Clear the CSRF secret cookie
    response.cookies.delete("csrfSecret");

    return response;
  } catch (error) {
    console.error("Error during Google callback processing:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
