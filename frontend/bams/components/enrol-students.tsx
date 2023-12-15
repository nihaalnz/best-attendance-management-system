"use client";

import { Countries, Courses, Student, StudentList } from "@/lib/types";
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
import { useSession } from "next-auth/react";

type backEndErrors = {
  [key: string]: string[];
};


const formSchema = z
  .object({
    course: z.array(z.string()).optional(),
    students: z.array(z.string()).optional(),
  })



async function fetchStudents (){
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/students-list`
      );
      return data;
}



export default function StudentEnrollment() {
    const session=useSession();
    const { toast } = useToast();

    const fetchCourses = async () => {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/teacher/courses`,
            {
              headers: {
                Authorization: `Token ${session?.data?.user.token!}`,
              },
            }
          );
          return data;
      };

  const {
    data: dataCourses,
    isLoading: isLoadingCourse,
    isError: isErrorCourse,
  } = useQuery<Courses>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
  const {
    data: dataStudents,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery<StudentList>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  
  // console.log(dataCountries)
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: [],
      students: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/enrol-student`, values);
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Student Enrolled",
        description: `Successfully Enrolled Successfully.`,
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
          title: "Student Enrollment failed.",
          description: `Failed to enroll student. ${errors}`,
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
    // form.reset();
    mutation.mutate(values);
    console.log("Values",values)
  };


  if (
    // isLoadingStudents || 
    isLoadingCourse) {
    return <Loader2 height="100px" width="100px" className="animate-spin" />;
  } else if (isErrorCourse 
    // || isErrorStudents
    ) {
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
console.log("Data Courses:",dataCourses);
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-x-12 gap-y-3 text-left"
        onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Combobox
                      options={dataCourses!.map((item) => ({
                        value: item.id.toString(),
                        label: `${item.code} - ${item.name}`,
                      }))}
                      value={field.value}
                      onValueChange={(value) => form.setValue("course", value)}
                      multiple
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Students</FormLabel>
                <FormControl>
                <Combobox
                      options={dataStudents!.map((students) => ({
                        value: students.student_id,
                        label: `${students.student_id} - ${students.name}`,
                      }))}
                      value={field.value}
                      onValueChange={(value) => form.setValue("students", value)}
                      multiple
                      />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" className="mt-6 col-span-2">
          Enroll Students
        </Button>
      </form>
    </Form>
  );
}
