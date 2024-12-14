"use server";

import { cookies } from "next/headers";
import { getExpiresAt } from "@/utils/getExpiresAt";
import { tokenExpirationTime, encrypt } from "./tokenUtils";

export async function generateTokensAction(email: string) {
  const accessTokenExpiresAt = getExpiresAt(tokenExpirationTime.accessToken);
  const refreshTokenExpiresAt = getExpiresAt(tokenExpirationTime.refreshToken);

  // Generate access token (short-lived)
  const accessToken = await encrypt(
    { email, expiresAt: accessTokenExpiresAt },
    tokenExpirationTime.accessToken
  );

  // Generate refresh token (long-lived)
  const refreshToken = await encrypt(
    { email, expiresAt: refreshTokenExpiresAt },
    tokenExpirationTime.refreshToken
  );

  const cookieStore = await cookies();

  // Set tokens in HTTP-only secure cookies
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessTokenExpiresAt,
    sameSite: "strict",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: refreshTokenExpiresAt,
    sameSite: "strict",
    path: "/",
  });
}
