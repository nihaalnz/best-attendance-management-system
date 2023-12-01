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
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, {AxiosResponse, AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";


type backEndErrors = {
    [key: string]: string[];
  }

  const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  

  export default function LogInForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
      mode: "onChange",
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });
  
    const mutation = useMutation({
      mutationFn: async (values: z.infer<typeof formSchema>) => {
        try {
          const response: AxiosResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/login/`,
            values
          );
          return response.data;
        } catch (error: unknown) {
            // Explicitly specify the type of error
            if (axios.isAxiosError(error)) {
              throw (error as AxiosError).response?.data || {};
            } else {
              console.error("Unexpected error type:", typeof error, error);
              throw error;
            }
          }
      },
      onSuccess: (data) => {
        console.log(data)
        toast({
          title: "Account Logged In Successfully.",
          description: `Successfully Logged In.`,
        });
        // form.reset();
      },
      onError: (error: AxiosError) => {
        const { response } = error;
        console.log(error)
        toast({
            variant: "destructive",
            title: "Log In Error.",
            description: `Failed to log in to account.`,
          });
        if (response?.data) {
          const backendErrors = response.data;
          const frontendErrors = compileFrontendErrors(backendErrors as any);
          const errors = Object.entries(frontendErrors)
          .map(([field, reason]) => `${field}: ${reason}`)
          .join('\n');
          console.log(errors);
        }
      },
    });
  
    const compileFrontendErrors = (backendErrors: backEndErrors) => {
        let frontendErrors = {};
        for (const field in backendErrors) {
          if (backendErrors.hasOwnProperty(field)) {
            (frontendErrors as any)[field] = backendErrors[field].join(", ");
          }
        }
        return frontendErrors;
      };
  
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
      console.log({ values });
      mutation.mutate(values);
    };
  
    return (
      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-x-12 gap-y-3 text-left"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
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
                <FormLabel>Enter Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Secret123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <Button type="submit" className="mt-6 col-span-2">
            Log In
          </Button>
        </form>
      </Form>
    );
  }