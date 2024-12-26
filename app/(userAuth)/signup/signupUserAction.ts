"use server";

import { createUser, getUserByEmail, getUserByUsername } from "@/db/user";
import { hashPassword } from "@/lib/password";
import { AuthProvider } from "@prisma/client";
import type { GoogleSignupFormValues } from "./GoogleSignupFinishForm";
import type { SignupFormValues } from "./SignupFormStepOne";
import {
  signupFormSchema,
  signupWithGoogleFormSchema,
} from "./signupFormSchema";

type SignupUserActionResult =
  | {
      success: false;
      error?: string;
      fieldErrors?: Partial<
        Record<keyof SignupFormValues | keyof GoogleSignupFormValues, string>
      >;
    }
  | {
      success: true;
      data: Record<string, unknown>;
    };

export const signupUserAction = async (
  data: SignupFormValues | GoogleSignupFormValues,
  authProvider: AuthProvider,
): Promise<SignupUserActionResult> => {
  let result:
    | ReturnType<typeof signupFormSchema.safeParse>
    | ReturnType<typeof signupWithGoogleFormSchema.safeParse>
    | undefined;
  if (authProvider === AuthProvider.BASIC) {
    result = signupFormSchema.safeParse(data);
  } else if (authProvider === AuthProvider.GOOGLE) {
    result = signupWithGoogleFormSchema.safeParse(data);
  }

  if (!result || !result.success) {
    return {
      success: false,
      error: "Invalid form data.",
    };
  }

  const userExists = await getUserByEmail(data.email);
  if (userExists) {
    return {
      success: false,
      error: "Account with this email already exists",
      fieldErrors: { email: "An account with this email already exists." },
    };
  }

  const usernameExists = await getUserByUsername(data.username);
  if (usernameExists) {
    return {
      success: false,
      error: "Username already in use",
      fieldErrors: {
        username: "Username is already in use. Please choose another username.",
      },
    };
  }

  const newUser = { ...data, authProvider };

  if (
    authProvider === AuthProvider.BASIC &&
    "password" in data &&
    data.password
  ) {
    const hashedPassword = await hashPassword(data.password);
    (newUser as SignupFormValues).password = hashedPassword;
  }

  console.log({ newUser });

  await createUser(newUser);
  // TODO: should do some error handling for prisma errors

  return result;
};
