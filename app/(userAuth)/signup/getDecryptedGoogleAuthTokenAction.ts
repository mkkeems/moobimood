"use server";

import { decrypt } from "@/actions/tokens/tokenUtils";
import { getUserByEmail } from "@/db/user";

export type DecryptedGoogleAuthTokenResponse =
  | ({
      email: string;
      accountAlreadyExists: boolean;
    } & Record<string, unknown>)
  | undefined;

export const getDecryptedGoogleAuthToken = async (
  googleAuthSuccess?: string,
): Promise<DecryptedGoogleAuthTokenResponse> => {
  const tempToken = googleAuthSuccess;
  if (!tempToken) return undefined;

  try {
    const payload = await decrypt(tempToken);
    console.log("Decrypted google auth success payload:", payload);
    const email = payload?.email;
    const expiresAt = payload?.expiresAt;

    if (!email || typeof email !== "string") {
      console.error("Failed to decrypt email:", email);
      return undefined;
    }
    if (!expiresAt || Date.now() > Number(expiresAt)) {
      console.error("Token has expired or invalid payload:", {
        email,
        expiresAt,
      });
      return undefined;
    }

    const accountAlreadyExists = await getUserByEmail(email);
    return { email, accountAlreadyExists: !!accountAlreadyExists, ...payload };
  } catch (error) {
    console.error("Failed to decrypt email:", error);
    return undefined;
  }
};
