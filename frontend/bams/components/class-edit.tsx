"use client";

import { Class } from "@/lib/types";
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
import { cn } from "@/lib/utils";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Ban } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

type backEndErrors = {
  [key: string]: string[];
};

const formSchema = z.object({
  location: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  date: z.date(),
  tutor: z.string(),
  is_cancelled: z.boolean(),
});


async function fetchClass(classId: string): Promise<Class> {
  // console.log("fetching", courseId)
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/class/${classId}`
  );
  return data;
}

interface EditClassProps {
  classId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditClass({ classId, setOpen }: EditClassProps) {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
  } = useQuery<Class, Error>({
    queryKey: ["class", classId],
    queryFn: async () => await fetchClass(classId),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/update-class/${classId}`,
        values, {
          headers: {
            Authorization: `Token ${session?.data?.user.token!}`,
          }
        }
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Class updated!",
        description: `Successfully updated class.`,
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["class", classId] });
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
          title: "Class updating failed.",
          description: `Failed to update class. ${errors}`,
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
    console.log(values);
    mutation.mutate({...values, date: format(values.date, "yyyy-MM-dd") as unknown as Date});
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
        className="grid grid-cols-2 gap-x-4 gap-y-3 text-left items-center"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="location"
          defaultValue={data?.location}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_time"
          defaultValue={data?.start_time}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="Enter Start Time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_time"
          defaultValue={data?.end_time}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="Enter Start Time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          defaultValue={new Date(data?.date!)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
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
          defaultValue={data?.tutor.toString()}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tutor</FormLabel>
              <Select
                defaultValue={data?.tutor.toString()}
                onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Tutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data?.course_tutors?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_cancelled"
          defaultValue={data?.is_cancelled}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">Cancel Class?</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-6 col-span-2">
          Update
        </Button>
      </form>
    </Form>
  );
}
