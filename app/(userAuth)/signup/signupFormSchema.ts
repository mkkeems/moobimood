import { z } from "zod";

export const signupFormSchema = z.object({
  username: z.string().trim().min(2, { message: "Username is required" }),
  email: z.string().trim().email().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" }),
});
