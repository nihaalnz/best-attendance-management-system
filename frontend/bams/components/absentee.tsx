"use client";

import { Countries, Courses } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Ban } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Combobox } from "./combobox";
import { Teachers } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

type backEndErrors = {
  [key: string]: string[];
};

const formSchema = z
  .object({
    start_date: z.date(),
    end_date: z.date().optional(),
    reason: z.string(),
    tutor: z.string(),
  })

async function fetchTeachers() {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/teachers`
  );
  return data;
}

export default function AbsenteeApplication() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { toast } = useToast();

  const {
    data: dataTeachers,
    isLoading: isLoadingTeachers,
    isError: isErrorTeachers,
  } = useQuery<Teachers>({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: new Date(),
      tutor: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formattedValues: z.infer<typeof formSchema>) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/request-absentee`, formattedValues, {
        headers: {
          Authorization: `Token ${session?.data?.user.token}`,
        }
      });
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Absentee Application Submitted",
        description: `Successfully submitted application.`,
      });
      form.reset();
      queryClient.invalidateQueries({queryKey: ['absentee']});
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
          title: "Submission Failed",
          description: `Failed to submit Application. ${errors}`,
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    mutation.mutate(values);
  };

  if (isLoadingTeachers) {
    return <Loader2 height="100px" width="100px" className="animate-spin" />;
  } else if (isErrorTeachers) {
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
        className="grid grid-cols-2 gap-x-12 gap-y-3 text-left"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  avoidCollisions={false}
                  className="w-auto p-0"
                  align="start">
                  <ScrollArea className="h-80">
                    <Calendar
                      mode="single"
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  avoidCollisions={false}
                  className="w-auto p-0"
                  align="start">
                  <ScrollArea className="h-80">
                    <Calendar
                      mode="single"
                      defaultMonth={field.value}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tutor"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Teacher</FormLabel>
              <FormControl>
                <Combobox
                  options={dataTeachers!.map((item) => ({
                    value: item.id.toString(),
                    label: `(${item.designation}) ${item.name}`,
                  }))}
                  value={field.value}
                  onValueChange={(value) => form.setValue("tutor", value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter reason for applying" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 col-span-2">
          Submit
        </Button>
      </form>
    </Form>
  );
}