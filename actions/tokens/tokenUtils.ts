import { SignJWT, jwtVerify } from "jose";

export const secretKey = process.env.SESSION_SECRET;
export const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  email: string;
  expiresAt: Date;
};

export const tokenExpirationTime = {
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
