"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { useAuthUser } from "@/queries/useAuthUserQuery";
import { useEffect } from "react";
import { getDecryptedGoogleAuthToken } from "../signup/getDecryptedGoogleAuthTokenAction";
import { useQueryClient } from "@tanstack/react-query";
import { generateTokensAction } from "@/actions/tokens/generateTokensAction";

const LoginPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const googleAuthToken = searchParams.get("google");

  const { data: authUser, isLoading, isError, status } = useAuthUser();

  useEffect(() => {
    if (authUser) {
      router.push("/");
    }
  }, [authUser, router]);

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
        googleAuthResponse.accountAlreadyExists &&
        googleAuthResponse.email
      ) {
        const { email } = googleAuthResponse;
        try {
          console.log("login works! great success");
          await generateTokensAction(email);
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          router.push("/");
        } catch (error) {
          console.error("Failed to generate tokens:", error);
        }
      }
    };
    fetchGoogleAuthResponse();
  }, [googleAuthToken]);

  return <LoginForm />;
};

export default LoginPage;
