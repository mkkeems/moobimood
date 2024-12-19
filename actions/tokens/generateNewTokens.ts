import { getExpiresAt, getMaxAge } from "@/utils/getSessionTime";
import { encrypt, tokenExpirationTime, TokenTypeEnum } from "./tokenUtils";

export const generateNewTokens = async ({
  tokenType,
  email,
  ...otherSessionPayload
}: {
  tokenType: TokenTypeEnum;
  email: string;
  otherSessionPayload?: Record<any, any>;
}) => {
  const tokenExpiresAt = getExpiresAt(tokenExpirationTime[tokenType]);

  const tokenPayload = {
    email,
    expiresAt: tokenExpiresAt,
  };

  if (otherSessionPayload) {
    Object.assign(tokenPayload, otherSessionPayload);
  }

  const token = await encrypt(tokenPayload, tokenExpirationTime[tokenType]);

  const tokenMaxAge = getMaxAge(tokenExpirationTime[tokenType]);

  return { token, tokenExpiresAt, tokenMaxAge };
};
