"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { compileFrontendErrors } from "@/lib/utils";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LogInForm() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.data?.user) {
      return router.push("/");
    }
  }, []);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const mutation = useMutation({
  //   mutationFn: (values: z.infer<typeof formSchema>) => {
  //     return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, values);
  //   },
  //   onSuccess: ({ data }) => {
  //     console.log(data);
  //     toast({
  //       title: "Account Logged In Successfully.",
  //       description: `Successfully Logged In.`,
  //     });
  //     signIn("credentials", {
  //       // @ts-ignore
  //       email: data.id,
  //       // @ts-ignore
  //       password: data.token,
  //       // callbackUrl: "/",
  //       // redirect: true,
  //     });

  //     // form.reset();
  //   },
  //   onError: (error: AxiosError) => {
  //     const { response } = error;
  //     console.log(response);
  //     if (response?.data) {
  //       const backendErrors = response.data;
  //       const frontendErrors = compileFrontendErrors(backendErrors as any);
  //       const errors = Object.entries(frontendErrors)
  //         .map(([field, reason]) => `${field}: ${reason}`)
  //         .join("\n");
  //       console.log(errors);
  //       toast({
  //         variant: "destructive",
  //         title: "Log In Error.",
  //         description: `Failed to log in to account. ${errors}`,
  //       });
  //     }
  //   },
  // });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    // mutation.mutate(values);
    const data = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    console.log(data);
    if (!data?.ok) {
      toast({
        variant: "destructive",
        title: "Log In Error.",
        description: `Failed to log in to account. Invalid credentials.`,
      });
    } else {
      toast({
        title: "Account Logged In Successfully.",
        description: `Successfully Logged In.`,
      });
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3 text-left w-96"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="gavin.belson@hooli.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Secret123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link className="text-sm self-end" href="/forget-passwrd">
          Forgot Password?
        </Link>
        <Button type="submit" className="mt-6 col-span-2">
          Log In
        </Button>
      </form>
    </Form>
  );
}
