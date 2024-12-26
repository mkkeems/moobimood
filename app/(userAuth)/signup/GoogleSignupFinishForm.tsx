"use client";

import { generateTokensAction } from "@/actions/tokens/generateTokensAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthProvider } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { DecryptedGoogleAuthTokenResponse } from "./getDecryptedGoogleAuthTokenAction";
import { signupWithGoogleFormSchema } from "./signupFormSchema";
import { signupUserAction } from "./signupUserAction";

export type GoogleSignupFormValues = z.infer<typeof signupWithGoogleFormSchema>;

function isKeyOfSignupFormValues(
  key: string,
): key is keyof GoogleSignupFormValues {
  return key in signupWithGoogleFormSchema.shape;
}

const GoogleSignupFinishForm = ({
  googleAuthResponse,
}: {
  googleAuthResponse: DecryptedGoogleAuthTokenResponse;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
  const [createAccountSuccess, setCreateAccountSuccess] = useState(false);

  useEffect(() => {
    let createAccountSuccesstimer: NodeJS.Timeout;
    if (createAccountSuccess) {
      createAccountSuccesstimer = setTimeout(() => {
        router.push("/");
      }, 2000);
    }

    return () => {
      clearTimeout(createAccountSuccesstimer);
    };
  }, [createAccountSuccess, router]);

  useLayoutEffect(() => {
    let accountAlreadyExiststimer: NodeJS.Timeout;
    if (googleAuthResponse?.accountAlreadyExists) {
      setAccountAlreadyExists(true);
      const generateTokensForNewUser = async () => {
        await generateTokensAction(googleAuthResponse.email);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      };

      generateTokensForNewUser();
      accountAlreadyExiststimer = setTimeout(() => {
        router.push("/");
      }, 2000);
    }

    return () => {
      clearTimeout(accountAlreadyExiststimer);
    };
  }, [googleAuthResponse, queryClient, router]);

  const form = useForm<GoogleSignupFormValues>({
    resolver: zodResolver(signupWithGoogleFormSchema),
    defaultValues: {
      email: googleAuthResponse?.email || "",
      username: "",
    },
  });

  const { handleSubmit, control, setError, setFocus } = form;

  const onSubmit = handleSubmit(async (values: GoogleSignupFormValues) => {
    const result = await signupUserAction(values, AuthProvider.GOOGLE);

    if (result.success) {
      const {
        data: { email },
      } = result;

      await generateTokensAction(email as string);
      try {
        await generateTokensAction(values.email);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        setCreateAccountSuccess(true);
      } catch (error) {
        console.error("Failed to generate tokens:", error);
      }
    } else {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(
          ([field, message], index) => {
            if (isKeyOfSignupFormValues(field)) {
              setError(field, {
                type: "manual",
                message,
              });

              if (index === 0) {
                setFocus(field);
              }
            }
          },
        );
      } else {
        if (result.error) {
          console.error(result.error);
        }
      }
    }
  });

  /**
   * TODO: Add styles
   */
  if (createAccountSuccess) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Account Created!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Your account has been successfully created. Redirecting you to the
            homepage...
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  /**
   * TODO: Add styles
   */
  if (accountAlreadyExists) {
    return (
      <div>Account with this email already exists. Redirect to home...</div>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Finish creating your account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={googleAuthResponse?.email}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="username" {...field} />
                  </FormControl>
                  <FormDescription>Please enter a username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-around">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link className="underline ml-2" href="login">
            Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSignupFinishForm;
