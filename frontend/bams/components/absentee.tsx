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
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Ban } from "lucide-react";
import { format } from "date-fns";
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
    end_date: z.date(),
    reason_type: z.enum(["mitigating", "sickleave", "other"]),
    reason: z.string(),
    tutors: z.array(z.string()).min(1),
    student:z.string(),
  })

async function fetchTeachers() {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/teachers`
  );
  return data;
}

export default function AbsenteeApplication() {

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
      end_date: new Date(),
      reason_type: "mitigating",
      reason: "",
      tutors: [],
      student:"",
    },
  });

  const mutation = useMutation({
    mutationFn: (formattedValues: z.infer<typeof formSchema>) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/request-absentee`, formattedValues);
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Absentee Application Submitted",
        description: `Successfully submitted application.`,
      });
      // form.reset();
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
    const studentEmail = session?.data?.user?.email;
  
    try {
      // Fetch student data using the student email
      const studentResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/get-student-by-email?email=${studentEmail}`
      );
      const studentData = studentResponse.data;
  
      if (!studentData) {
        // Handle the case where the student is not found
        console.error(`Student not found for email: ${studentEmail}`);
        return;
      }
  
      // Create a new object with formatted date strings
      const formattedValues = {
        ...values,
        start_date: format(new Date(values.start_date), 'yyyy-MM-dd'),
        end_date: format(new Date(values.end_date), 'yyyy-MM-dd'),
        student_email: session?.data?.user?.email, 
      };
  
      console.log("Formatted Values:", formattedValues);
      console.log("User Role:", session?.data?.user?.email);
      console.log("user:", studentData.student_id);
  
      mutation.mutate(formattedValues);
    } catch (error) {
      console.error("Error fetching student data:", error);
      // Handle the error as needed
    }
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
            <FormItem className="col-span-2">
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
                        format(field.value, "yyyy-MM-dd")
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
            <FormItem className="col-span-2">
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
                        format(field.value, "yyyy-MM-dd")
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
          name="tutors"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Teacher(s)</FormLabel>
              <FormControl>
                <Combobox
                  options={dataTeachers!.map((item) => ({
                    value: item.id.toString(),
                    label: `(${item.designation}) ${item.name}`,
                  }))}
                  value={field.value}
                  onValueChange={(value) => form.setValue("tutors", value)}
                  multiple
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason_type"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Reason</FormLabel>
              <Select defaultValue="mititgating" onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mitigating">Mitigating Circumstances</SelectItem>
                  <SelectItem value="sickleave">Sick Leave</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <Button type="submit" className="mt-6 col-span-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}