"use client";

import { Countries,Courses, Teachers } from "@/lib/types";
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
import { Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useMutation, useQuery, QueryFunction, QueryKey, UseQueryOptions, UseQueryResult   } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Ban } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { fr } from "date-fns/locale";


type backEndErrors = {
  [key: string]: string[];
}

const formSchema = z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    tutors: z.number().optional(),
  });

async function fetchTeachers() {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/teachers`);
  return data;
}

async function fetchCourses(): Promise<Courses> {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`);
    return data;
}


interface EditCourseProps {
    courseCode: string;
  }
  
  export default function EditCourse({ courseCode }: EditCourseProps) {

    console.log('Course Code:', courseCode);
    const { toast } = useToast();
  
    const {
      data: dataTeachers,
      isLoading: isLoadingTeachers,
      isError: isErrorTeachers,
    } = useQuery<Teachers>({
      queryKey: ["teachers"],
      queryFn: fetchTeachers,
    });
  
    const {
        data: coursesData,
        isLoading: isLoadingCourses,
        isError: isErrorCourses,
    } = useQuery<Courses, Error>({
        queryKey: ['courses'],
        queryFn: fetchCourses,
    });

    const selectedCourse = coursesData?.find((course) => course.code === courseCode);

    console.log("Selected Course:", selectedCourse);

    console.log("CourseData:",coursesData);
  
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
      
    });

    console.log("Selected Name", selectedCourse?.name);
  
    const mutation = useMutation({
      mutationFn: (values: z.infer<typeof formSchema>) => {
        return axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/updatecourse/${courseCode}`,
          values
        );
      },
      onSuccess: (data) => {
        console.log(data);
        console.log("Hello World");
        toast({
          title: "Course updated.",
          description: `Successfully updated course.`,
        });
      },
      onError: (error: AxiosError) => {
        const { response } = error;
        if (response?.data) {
          const backendErrors = response.data;
          const frontendErrors = compileFrontendErrors(backendErrors as any);
          const errors = Object.entries(frontendErrors)
          .map(([field, reason]) => `${field}: ${reason}`)
          .join('\n');
          console.log("World Hello")
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
      console.log("Values",values);
      mutation.mutate(values);
    };
  
    if (isLoadingTeachers || isLoadingCourses) {
      return <Loader2 height="100px" width="100px" className="animate-spin" />;
    } else if (isErrorTeachers || isErrorCourses) {
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
          className="grid grid-cols-2 gap-x-4 gap-y-3 text-left items-center mx-auto"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem className="col-span-2">
      <FormLabel>Course Name</FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder="Enter Course Name"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  defaultValue={selectedCourse?.name}/>

<FormField
  control={form.control}
  name="code"
  render={({ field }) => (
    <FormItem className="col-span-2">
      <FormLabel>Code</FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder="Enter Code"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  defaultValue={selectedCourse?.code}/>

<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem className="col-span-4">
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Enter Description"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  defaultValue={selectedCourse?.description}/>

<FormField
  control={form.control}
  name="tutors"
  render={({ field }) => (
    <FormItem className="col-span-4 pl-2">
      <FormLabel>Teacher</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value
                  ? dataTeachers?.find(
                      (teacher) => teacher.id === field.value
                    )?.name
                  : "Select teacher"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search teacher..." />
              <CommandEmpty>No such teacher found.</CommandEmpty>
              <CommandGroup>
                {dataTeachers?.map((teacher) => (
                  <CommandItem
                    value={`${teacher.designation} - ${teacher.name}`}
                    key={teacher.id}
                    onSelect={() => {
                      form.setValue("tutors", teacher.id);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        teacher.id === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {`${teacher.designation} - ${teacher.name}`}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
          </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  defaultValue={selectedCourse?.tutors}
/>
          <Button type="submit" className="mt-6 col-span-4">
            Update
          </Button>
        </form>
      </Form>
    );
  }