"use server";

import { getUserByEmail } from "@/db/user";
import { verifyPassword } from "@/lib/password";
import { AuthProvider } from "@prisma/client";
import type { LoginFormValues } from "./LoginForm";
import { loginFormSchema } from "./loginFormSchema";

type LoginUserActionResult =
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof LoginFormValues, string>>;
    }
  | {
      success: true;
      email: string;
    };

export const loginUserAction = async (
  data: LoginFormValues,
): Promise<LoginUserActionResult> => {
  const result = loginFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid form data.",
    };
  }

  const { email: emailInput, password: passwordInput } = data;

  const user = await getUserByEmail(emailInput);
  if (!user) {
    return {
      success: false,
      error: "User does not exist.",
      fieldErrors: { email: "User does not exist." },
    };
  }

  const { password, authProvider } = user;

  if (authProvider !== AuthProvider.BASIC && !password) {
    return {
      success: false,
      error: "Invalid login method",
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Invalid login method",
    };
  }

  const isPasswordCorrect = await verifyPassword(passwordInput, password);

  if (!isPasswordCorrect) {
    return {
      success: false,
      error: "Invalid password.",
      fieldErrors: { password: "Invalid password." },
    };
  }

  return { success: true, email: emailInput };
};
