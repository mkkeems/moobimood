"use client";

import { generateTokensAction } from "@/actions/tokens/generateTokensAction";
import { useAuthUser } from "@/queries/useAuthUserQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getDecryptedGoogleAuthToken } from "../signup/getDecryptedGoogleAuthTokenAction";
import { LoginForm } from "./LoginForm";

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
      const googleAuthResponse =
        await getDecryptedGoogleAuthToken(googleAuthToken);

      if (!googleAuthResponse) {
        return;
      }

      if (
        googleAuthResponse?.accountAlreadyExists &&
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
  }, [googleAuthToken, queryClient, router]);

  return <LoginForm />;
};

export default LoginPage;
