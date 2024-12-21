import { config } from "@/config";
import { isValid } from "date-fns";
import { EncryptJWT, jwtDecrypt } from "jose";
import type { JWTPayload } from "jose";

export const secretKey = config.SESSION_SECRET;

export async function getEncodedKey() {
  if (!secretKey) {
    throw new Error("SESSION_SECRET is not defined");
  }

  return await crypto.subtle.importKey(
    "raw",
    Buffer.from(secretKey, "base64"),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"],
  );
}

export type SessionPayload = {
  email: string;
  expiresAt: Date;
} & Record<string, unknown>;

export enum TokenTypeEnum {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
  tempAuthToken = "tempAuthToken",
}

export const tokenExpirationTime: { [key in TokenTypeEnum]: string } = {
  accessToken: "15m",
  refreshToken: "7d",
  tempAuthToken: "15m",
};

export async function encrypt(payload: SessionPayload, expTime: string) {
  const encodedKey = await getEncodedKey();

  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(expTime)
    .encrypt(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const encodedKey = await getEncodedKey();
    const { payload } = await jwtDecrypt(session, encodedKey);
    return payload;
  } catch (error) {
    console.error("Failed to verify session");
  }
}

export function isSessionPayload(
  payload: JWTPayload | undefined,
): payload is SessionPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof payload.email === "string" &&
    typeof payload.expiresAt === "string" &&
    isValid(new Date(payload.expiresAt))
  );
}
