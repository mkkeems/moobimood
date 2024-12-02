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
import { SignupFormSchema } from "./signupFormSchema";
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
import { signupUserAction } from "./signupUserAction";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

function isKeyOfSignupFormValues(key: string): key is keyof SignupFormValues {
  return key in SignupFormSchema.shape;
}

const SignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const { handleSubmit, control, setError, setFocus } = form;

  const onSubmit = async (values: SignupFormValues) => {
    const result = await signupUserAction(values);

    if (result.success) {
      /**
       * TODO:
       * On signup success, add session + redirect to dashboard
       */
      console.log("user created! great success");
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
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Sign up to create your MoobiMood account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleSignInButton redirectPath="/" />
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

export default SignupForm;
