"use server";

import { cookies } from "next/headers";
import { generateTokensAction } from "./generateTokensAction";
import { decrypt } from "./tokenUtils";
import { getExpiresAt } from "@/utils/getExpiresAt";

export async function refreshTokensAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return { success: false, error: "No refresh token provided." };
  }

  // Decrypt the refresh token to get the payload
  const payload = await decrypt(refreshToken);

  if (!payload) {
    return { success: false, error: "Invalid refresh token." };
  }

  // Check if the refresh token has expired
  const { email, expiresAt } = payload;

  if (!email) {
    return { success: false, error: "Invalid token payload." };
  }

  if (expiresAt && Date.now() >= Date.now(expiresAt)) {
    return { success: false, error: "Refresh token has expired." };
  }

  // Generate new tokens and set cookies
  await generateTokensAction(email);

  return { success: true };
}
