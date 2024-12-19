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
import { signupWithGoogleFormSchema } from "./signupFormSchema";
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
import { DecryptedGoogleAuthEmailResponse } from "./getDecryptedGoogleAuthEmailAction";
import SignupFormStepOne from "./SignupFormStepOne";
import { AuthProvider } from "@prisma/client";

export type GoogleSignupFormValues = z.infer<typeof signupWithGoogleFormSchema>;

function isKeyOfSignupFormValues(
  key: string
): key is keyof GoogleSignupFormValues {
  return key in signupWithGoogleFormSchema.shape;
}

const SignupForm = ({
  googleAuthResponse,
}: {
  googleAuthResponse?: DecryptedGoogleAuthEmailResponse;
}) => {
  console.log({ ...googleAuthResponse });

  const form = useForm<GoogleSignupFormValues>({
    resolver: zodResolver(signupWithGoogleFormSchema),
    defaultValues: {
      email: googleAuthResponse?.email,
      username: "",
    },
  });

  const { handleSubmit, control, setError, setFocus } = form;

  const onSubmit = handleSubmit(async (values: GoogleSignupFormValues) => {
    console.log({ values });
    const result = await signupUserAction(values, AuthProvider.GOOGLE);

    console.log({ result });

    if (result.success) {
      /**
       * TODO:
       * - On signup success, add session + redirect to previous page
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
  });

  if (
    googleAuthResponse &&
    googleAuthResponse.email &&
    googleAuthResponse.accountAlreadyExists
  ) {
    return (
      <div>Account with this email already exists. Redirect to home...</div>
    );
  }
  if (
    googleAuthResponse &&
    googleAuthResponse.email &&
    !googleAuthResponse.accountAlreadyExists
  ) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Finish creating your account</CardTitle>
          {/* <CardDescription>Finish creating your account</CardDescription> */}
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
                        defaultValue={googleAuthResponse?.email}
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
  }
  return <SignupFormStepOne />;
};

export default SignupForm;
