"use server";

import { cookies } from "next/headers";
import { generateNewTokens } from "./generateNewTokens";
import { TokenTypeEnum } from "./tokenUtils";

export async function generateTokensAction(email: string) {
  console.log("getting them new new tokens yeaaaa");
  const {
    token: accessToken,
    tokenExpiresAt: accessTokenExpiresAt,
    tokenMaxAge: accessTokenMaxAge,
  } = await generateNewTokens({ email, tokenType: TokenTypeEnum.accessToken });

  const {
    token: refreshToken,
    tokenExpiresAt: refreshTokenExpiresAt,
    tokenMaxAge: refreshTokenMaxAge,
  } = await generateNewTokens({ email, tokenType: TokenTypeEnum.refreshToken });

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessTokenExpiresAt,
    sameSite: "strict",
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: refreshTokenExpiresAt,
    sameSite: "strict",
    path: "/",
    maxAge: refreshTokenMaxAge,
  });
}
