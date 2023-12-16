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
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Ban } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "./combobox";

type backEndErrors = {
  [key: string]: string[];
};

const formSchema = z.object({
  action: z.enum(["approved", "rejected", "pending"]),
  reason: z.string().optional(),
});

async function fetchApplication(applicationId: string) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/request-absentee/${applicationId}`
  );
  return data;
}

interface AbsenteeActionProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  applicationId: string;
}
const options = [
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "pending",
    label: "Pending",
  },
];
export default function AbsenteeAction({
  applicationId,
  setOpen,
}: AbsenteeActionProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => fetchApplication(applicationId),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/respond-absentee/${applicationId}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Action updated.",
        description: `Successfully updated action for absentee application.`,
      });
      queryClient.invalidateQueries({ queryKey: ["absentee"] });
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      setOpen(false);
    },
    onError: (error: AxiosError) => {
      const { response } = error;
      if (response?.data) {
        const backendErrors = response.data;
        const frontendErrors = compileFrontendErrors(backendErrors as any);
        const errors = Object.entries(frontendErrors)
          .map(([field, reason]) => `${field}: ${reason}`)
          .join("\n");
        console.log(errors);
        toast({
          variant: "destructive",
          title: "Course creation failed.",
          description: `Failed to create course. ${errors}`,
        });
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
    console.log("Values", values);
    mutation.mutate(values);
  };

  if (isLoading) {
    return <Loader2 height="100px" width="100px" className="animate-spin" />;
  } else if (isError) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center">
        <Ban color="#ff0000" height="100px" width="100px" />
        <h1>
          We are unable to process your request due to some error, please try
          again later
        </h1>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col text-left items-stretch gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="action"
          defaultValue={data?.status}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Combobox
                  options={options!.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue(
                      "action",
                      value as "approved" | "rejected" | "pending"
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          defaultValue={data?.status !== 'pending' ? data?.response_reason : ""}
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full"
                  placeholder="Enter Reason"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 col-span-4">
          Respond
        </Button>
      </form>
    </Form>
  );
}
