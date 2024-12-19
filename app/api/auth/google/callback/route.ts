import { NextRequest, NextResponse } from "next/server";
import csrf from "csrf";
import { generateNewTokens } from "@/actions/tokens/generateNewTokens";
import { TokenTypeEnum } from "@/actions/tokens/tokenUtils";

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

    // const {
    //   token: tempAuthToken,
    //   tokenExpiresAt: tempAuthTokenExpiresAt,
    //   tokenMaxAge: tempAuthTokenMaxAge,
    // } = await generateNewTokens({ email, tokenType: TokenTypeEnum.tempAuthToken });

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
    // Fetch user info from Google using the access token
    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    console.log({ userInfoResponse });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }
    const userInfo = await userInfoResponse.json();
    console.log("User Info:", userInfo);

    if (userInfo.email) {
      const email = userInfo.email;
      console.log("User email:", email);

      const {
        token: tempToken,
        tokenExpiresAt: tempTokenExpiresAt,
        tokenMaxAge: tempTokenMaxAge,
      } = await generateNewTokens({
        email,
        tokenType: TokenTypeEnum.tempAuthToken,
      });

      if (!tempToken) {
        throw new Error("Failed to generate temp token");
      }

      response.cookies.set("tempToken", tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: tempTokenExpiresAt,
        sameSite: "strict",
        path: "/",
        maxAge: tempTokenMaxAge,
      });
    }
    // Clear the CSRF secret cookie
    response.cookies.delete("csrfSecret");
    response.cookies.delete("previousPage");

    return response;
  } catch (error) {
    console.error("Error during Google callback processing:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
