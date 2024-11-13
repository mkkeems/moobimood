"use client";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupFormSchema } from "../signupFormSchema";

const Page = () => {
  const form = useForm<z.output<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      nickname: "",
    },
  });

  return (
    <div>
      <h1>Sign Up</h1>
      {/* <Form {...form}></Form> */}
    </div>
  );
};

export default Page;
