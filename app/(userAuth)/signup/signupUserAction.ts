"use server";

import { SignupFormSchema } from "./signupFormSchema";
import { SignupFormValues } from "./SignupForm";
import { createUser, getUserByEmail, getUserByUsername } from "@/db/user";
import { hashPassword } from "@/lib/hashPassword";

type SignupUserActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof SignupFormValues, string>>;
};

export const signupUserAction = async (
  data: SignupFormValues
): Promise<SignupUserActionResult> => {
  const result = SignupFormSchema.safeParse(data);

  if (!result.success) {
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

  const nickNameExists = await getUserByUsername(data.username);
  if (nickNameExists) {
    return {
      success: false,
      error: "Username already in use",
      fieldErrors: {
        username: "Username is already in use. Please choose another username.",
      },
    };
  }

  const hashedPassword = await hashPassword(data.password);

  // TODO: should do some error handling for prisma errors
  await createUser({ ...data, password: hashedPassword });

  return result;
};
