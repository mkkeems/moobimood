import { jwtVerify } from "jose";

export async function verifyGoogleToken(idToken: string) {
  const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
  const JWKS = await fetch(GOOGLE_JWKS_URL).then((res) => res.json());

  const key = JWKS.keys[0]; // Use appropriate `kid` to find the correct key
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const { payload } = await jwtVerify(idToken, publicKey, {
    issuer: "https://accounts.google.com",
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  return payload;
}
