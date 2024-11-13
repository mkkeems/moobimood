import { z } from "zod";

export const signupFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  nickname: z.string().min(2),
});

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});
