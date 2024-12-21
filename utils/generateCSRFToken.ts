/**
 * TODO:
 * Generate a CSRF token for google OIDC
 * https://developers.google.com/identity/openid-connect/openid-connect#createxsrftoken
 *
 * */
import csrf from "csrf";

export const generateCSRFToken = () => {
  const tokens = new csrf();
  const secret = tokens.secretSync();
  return {
    secret,
    csrfToken: tokens.create(secret),
  };
};
