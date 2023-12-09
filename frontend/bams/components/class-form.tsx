"use client";

import { Courses, Teachers } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Ban, CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "./combobox";
import { Dispatch, SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type backEndErrors = {
  [key: string]: string[];
};

const formSchema = z.object({
  location: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  date: z.date(),
  tutor: z.string(),
});

async function fetchCourseTeachers(course_id: string) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/course-teachers/${course_id}`
  );
  return data;
}

export default function ClassForm({
  setOpen,
  courseId,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: dataTeachers,
    isLoading: isLoadingTeachers,
    isError: isErrorTeachers,
  } = useQuery<Teachers>({
    queryKey: ["teachers"],
    queryFn:  () => fetchCourseTeachers(courseId),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      start_time: "09:00",
      end_time: "10:00",
      location: "",
      // tutor: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/add-class`,
        values
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Course created.",
        description: `Successfully created course.`,
      });
      // form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: AxiosError) => {
      const { response } = error;
      if (response?.data) {
        const backendErrors = response.data;
        const frontendErrors = compileFrontendErrors(backendErrors as any);
        const errors = Object.entries(frontendErrors)
          .map(([field, reason]) => `${field}: ${reason}`)
          .join("\n");
        console.log("World Hello");
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
    const date = format(values.date, 'yyyy-MM-dd');
    console.log(values);
    // @ts-ignore
    mutation.mutate({...values, course: courseId, date});
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
  // console.log(dataTeachers);
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-x-4 gap-y-3 text-left items-center mx-auto"
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="location"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tutor</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Tutor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dataTeachers?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 col-span-2">
          Create
        </Button>
      </form>
    </Form>
  );
}
