import { getExpiresAt, getMaxAge } from "@/utils/getSessionTime";
import { encrypt, tokenExpirationTime, TokenTypeEnum } from "./tokenUtils";

export const generateNewTokens = async ({
  tokenType,
  email,
}: {
  tokenType: TokenTypeEnum;
  email: string;
}) => {
  const tokenExpiresAt = getExpiresAt(tokenExpirationTime[tokenType]);

  const token = await encrypt(
    { email, expiresAt: tokenExpiresAt },
    tokenExpirationTime[tokenType]
  );

  const tokenMaxAge = getMaxAge(tokenExpirationTime[tokenType]);

  return { token, tokenExpiresAt, tokenMaxAge };
};
