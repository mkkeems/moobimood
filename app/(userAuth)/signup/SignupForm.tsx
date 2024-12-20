"use client";

import { useEffect, useState, useRef } from "react";
import GoogleSignupFinishForm from "./GoogleSignupFinishForm";
import SignupFormStepOne from "./SignupFormStepOne";
import {
  DecryptedGoogleAuthTokenResponse,
  getDecryptedGoogleAuthToken,
} from "./getDecryptedGoogleAuthTokenAction";
import { useRouter, useSearchParams } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleAuthToken = searchParams.get("google");

  const [googleAuthResponse, setGoogleAuthResponse] =
    useState<DecryptedGoogleAuthTokenResponse>();
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(googleAuthToken ? true : false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!googleAuthToken) {
      return;
    }
    const fetchGoogleAuthResponse = async () => {
      const googleAuthResponse = await getDecryptedGoogleAuthToken(
        googleAuthToken
      );

      if (!googleAuthResponse) {
        return;
      }

      if (
        googleAuthResponse &&
        googleAuthResponse.expiresAt &&
        googleAuthResponse.email
      ) {
        setGoogleAuthResponse(googleAuthResponse);
        setLoading(false);
        const expiresAt = new Date(googleAuthResponse.expiresAt).getTime();
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
  }, [googleAuthToken]);

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

export default SignupForm;
