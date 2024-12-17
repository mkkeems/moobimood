"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/actions/tokens/tokenUtils";

export const getDecryptedGoogleAuthEmail = async (): Promise<
  string | undefined
> => {
  const cookieStore = await cookies();
  const encryptedEmail = cookieStore.get("tempUserEmail")?.value;
  if (!encryptedEmail) return undefined;

  try {
    const payload = await decrypt(encryptedEmail);
    const email = payload?.email;
    return typeof email === "string" ? email : undefined;
  } catch (error) {
    console.error("Failed to decrypt email:", error);
    return undefined;
  }
};
