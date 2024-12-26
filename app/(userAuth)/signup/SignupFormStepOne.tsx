"use client";

import { generateTokensAction } from "@/actions/tokens/generateTokensAction";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
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
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signupFormSchema } from "./signupFormSchema";
import { signupUserAction } from "./signupUserAction";

export type SignupFormValues = z.infer<typeof signupFormSchema>;

function isKeyOfSignupFormValues(key: string): key is keyof SignupFormValues {
  return key in signupFormSchema.shape;
}

const SignupFormStepOne = () => {
  const queryClient = useQueryClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const { handleSubmit, control, setError, setFocus } = form;

  const onSubmit = handleSubmit(async (values: SignupFormValues) => {
    const result = await signupUserAction(values, AuthProvider.BASIC);

    if (result.success) {
      const {
        data: { email },
      } = result;

      await generateTokensAction(email as string);
      try {
        await generateTokensAction(values.email);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
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

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Sign up to create your MoobiMood account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center space-y-2">
          <GoogleSignInButton nextPath={"/signup"} />
        </div>
        <div className="flex items-center justify-center w-full my-4">
          <hr className="w-full border-1 border-gray-300" />
          <span className="mx-2 text-sm text-gray-400">OR</span>
          <hr className="w-full border-1 border-gray-300" />
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
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
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>Please enter your password.</FormDescription>
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

export default SignupFormStepOne;
