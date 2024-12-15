"use server";

import { cookies } from "next/headers";
import { generateTokensAction } from "./generateTokensAction";
import { decrypt, isSessionPayload } from "./tokenUtils";

export async function refreshTokensAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { success: false, error: "No refresh token provided." };
  }

  const payload = await decrypt(refreshToken);

  if (!isSessionPayload(payload)) {
    return { success: false, error: "Invalid token payload." };
  }

  const { email, expiresAt } = payload;

  if (new Date() >= new Date(expiresAt)) {
    return { success: false, error: "Refresh token has expired." };
  }

  await generateTokensAction(email);

  return { success: true };
}
