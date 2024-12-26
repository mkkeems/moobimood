"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import GoogleSignupFinishForm from "./GoogleSignupFinishForm";
import SignupFormStepOne from "./SignupFormStepOne";
import {
  type DecryptedGoogleAuthTokenResponse,
  getDecryptedGoogleAuthToken,
} from "./getDecryptedGoogleAuthTokenAction";

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleAuthToken = searchParams.get("google");

  const [googleAuthResponse, setGoogleAuthResponse] =
    useState<DecryptedGoogleAuthTokenResponse>();
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(!!googleAuthToken);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    if (!googleAuthToken) {
      return;
    }
    const fetchGoogleAuthResponse = async () => {
      const googleAuthResponse =
        await getDecryptedGoogleAuthToken(googleAuthToken);

      if (!googleAuthResponse) {
        return;
      }

      if (googleAuthResponse?.expiresAt && googleAuthResponse.email) {
        setGoogleAuthResponse(googleAuthResponse);
        setLoading(false);
        const expiresAt = new Date(
          googleAuthResponse.expiresAt as string,
        ).getTime();
        const now = Date.now();
        const remainingTime = expiresAt - now;

        if (remainingTime <= 0) {
          setExpired(true);
          router.replace("/signup");
          return;
        }

        timeoutRef.current = setTimeout(() => {
          setExpired(true);
          router.replace("/signup");
        }, remainingTime);
      } else {
        setExpired(true);
        router.replace("/signup");
      }
    };
    fetchGoogleAuthResponse();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [googleAuthToken, router]);

  if (!googleAuthToken || expired || !googleAuthResponse) {
    return <SignupFormStepOne />;
  }

  /**
   * TODO: Add styles. Replace loading with skeleton loader
   */
  if (googleAuthToken && loading) {
    return <p>Loading...</p>;
  }

  return <GoogleSignupFinishForm googleAuthResponse={googleAuthResponse} />;
};

export default SignupPage;
