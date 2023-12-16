"use client";

import { Course, Teachers } from "@/lib/types";
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
import { Loader2, Ban } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/combobox";
import { Dispatch, SetStateAction } from "react";

type backEndErrors = {
  [key: string]: string[];
};

const formSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  tutors: z.array(z.string()),
});

async function fetchTeachers() {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/teachers`
  );
  return data;
}

async function fetchCourse(courseId: string): Promise<Course> {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/course/${courseId}`
  );
  console.log(data);
  return data;
}

interface EditCourseProps {
  courseId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditCourse({ courseId, setOpen }: EditCourseProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
  } = useQuery<Course, Error>({
    queryKey: ["course", courseId],
    queryFn: async () => await fetchCourse(courseId),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/updatecourse/${courseId}`,
        values
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Course updated!",
        description: `Successfully updated course.`,
      });
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
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
          title: "Course updating failed.",
          description: `Failed to update course. ${errors}`,
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
        onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Course Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          defaultValue={coursesData?.name}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          defaultValue={coursesData?.code}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          defaultValue={coursesData?.description}
        />

        <FormField
          control={form.control}
          name="tutors"
          defaultValue={coursesData?.tutors.map(String)}
          render={({ field }) => (
            <FormItem className="col-span-4 pl-2">
              <FormLabel>Teacher</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  options={dataTeachers!.map((item) => ({
                    value: item.id.toString(),
                    label: `(${item.designation}) ${item.name}`,
                  }))}
                  onValueChange={(value) => form.setValue("tutors", value)}
                  multiple
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6 col-span-4">
          Update
        </Button>
      </form>
    </Form>
  );
}
