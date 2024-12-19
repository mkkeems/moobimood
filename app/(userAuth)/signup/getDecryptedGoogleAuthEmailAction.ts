"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/actions/tokens/tokenUtils";
import { getUserByEmail } from "@/db/user";

export type DecryptedGoogleAuthEmailResponse =
  | {
      email: string;
      accountAlreadyExists: boolean;
    }
  | undefined;

export const getDecryptedGoogleAuthEmail =
  async (): Promise<DecryptedGoogleAuthEmailResponse> => {
    const cookieStore = await cookies();
    const tempToken = cookieStore.get("tempToken")?.value;
    if (!tempToken) return undefined;

    try {
      const payload = await decrypt(tempToken);
      console.log("Decrypted google auth success payload:", payload);
      const email = payload?.email;

      if (typeof email !== "string") {
        console.error("Failed to decrypt email:", email);
        return undefined;
      }

      const accountAlreadyExists = await getUserByEmail(email);
      return { email, accountAlreadyExists: !!accountAlreadyExists };
    } catch (error) {
      console.error("Failed to decrypt email:", error);
      return undefined;
    }
  };
