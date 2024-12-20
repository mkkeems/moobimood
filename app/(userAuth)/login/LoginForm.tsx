"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "./loginFormSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { loginUserAction } from "./loginUserAction";
import { generateTokensAction } from "@/actions/tokens/generateTokensAction";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export type LoginFormValues = z.infer<typeof loginFormSchema>;

function isKeyOfSignupFormValues(key: string): key is keyof LoginFormValues {
  return key in loginFormSchema.shape;
}

const LoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, setError, setFocus } = form;

  const onSubmit = handleSubmit(async (values: LoginFormValues) => {
    const result = await loginUserAction(values);
    if (result.success) {
      const { email } = result;
      try {
        console.log("login works! great success");
        await generateTokensAction(email);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        router.push("/");
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
          }
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
        <CardTitle>Log In</CardTitle>
        <CardDescription>Log into your Moobimood account.</CardDescription>
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
          Don't have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
