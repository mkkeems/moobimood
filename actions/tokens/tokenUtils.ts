import { isValid } from "date-fns";
import { SignJWT, jwtVerify } from "jose";

export const secretKey = process.env.SESSION_SECRET;
export const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  email: string;
  expiresAt: Date;
};

export enum TokenTypeEnum {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}

export const tokenExpirationTime: { [key in TokenTypeEnum]: string } = {
  accessToken: "15m",
  refreshToken: "7d",
};

export async function encrypt(payload: SessionPayload, expTime: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export function isSessionPayload(payload: any): payload is SessionPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof payload.email === "string" &&
    typeof payload.expiresAt === "string" &&
    isValid(new Date(payload.expiresAt))
  );
}
