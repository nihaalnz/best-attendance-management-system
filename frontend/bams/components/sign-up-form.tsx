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

type backEndErrors = {
  [key: string]: string[];
}

const formSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    phone: z.string().min(13).max(13),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
    dob: z.date(),
    nationality: z.string().max(2),
    accountType: z.enum(["student", "teacher"]),
    student_id: z.string().optional(),
    course: z.array(z.number()).optional(),
    designation: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  )
  .refine(
    (data) => {
      if (data.accountType === "student") {
        return !!data.student_id && !!data.course;
      }
      return true;
    },
    {
      message: "Student ID and Course are required",
      path: ["student_id", "course"],
    }
  )
  .refine(
    (data) => {
      if (data.accountType === "teacher") {
        console.log(!!data.designation);
        return !!data.designation;
      }
      return true;
    },
    {
      message: "Designation is required",
      path: ["designation"],
    }
  );

async function fetchCourses() {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/courses`);
  return data;
}

async function fetchCountries() {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/countries`);
  return data;
}

export default function SignUpForm() {
  const { toast } = useToast();

  const {
    data: dataCourses,
    isLoading: isLoadingCourse,
    isError: isErrorCourse,
  } = useQuery<Courses>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
  const {
    data: dataCountries,
    isLoading: isLoadinCountries,
    isError: isErrorCountries,
  } = useQuery<Countries>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
  // console.log(dataCountries)
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      confirm_password: "",
      dob: new Date("2000-01-01"),
      accountType: "student",
      nationality: "",
      course: [],
      student_id: "",
      designation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/signup`, values);
    },
    onSuccess: (data) => {
      console.log(data)
      toast({
        title: "Account created.",
        description: `Successfully created account.`,
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
        .join('\n');
        console.log(errors);
        toast({
          variant: "destructive",
          title: "Account creation failed.",
          description: `Failed to create account. ${errors}`,
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
    const formattedValues = {
        ...values,
        courses: values.course, // Assuming the form field is named 'course'
    };
    form.reset();
    mutation.mutate(formattedValues);
};


  const accountType = form.watch("accountType");

  if (isLoadinCountries || isLoadingCourse) {
    return <Loader2 height="100px" width="100px" className="animate-spin" />;
  } else if (isErrorCourse || isErrorCountries) {
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input type="phone" placeholder="+971501087623" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Gavin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Belson" {...field} />
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
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Secret123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
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
                      disabled={(date) => date > new Date()}
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
          name="nationality"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nationality</FormLabel>
              <br />
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
                        )}>
                        {field.value
                          ? dataCountries!.find(
                              (country) => country.code === field.value
                            )?.name
                          : "Select country"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <ScrollArea className="h-80">
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {dataCountries!.map((country) => (
                            <CommandItem
                              className=""
                              value={country.name}
                              key={country.code}
                              onSelect={() => {
                                form.setValue("nationality", country.code);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  country.code === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {country.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem className="col-span-2 text-center">
              <FormLabel>Account Type</FormLabel>
              <Select defaultValue="student" onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {accountType === "student" && (
          <>
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Student ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <br />
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {Array.isArray(field.value) && field.value.length > 0
                            ? "Course Selected"
                            : "Select course"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {dataCourses!.map((course) => (
                          <DropdownMenuCheckboxItem
                          key={course.id}
                          checked={Array.isArray(field.value) && field.value.includes(course.id)}
                          onSelect={() => {
                            const selectedCourses: number[] = Array.isArray(field.value) ? [...field.value] : [];
                            
                            // Ensure that course.id is defined before processing
                            if (course.id !== undefined) {
                                if (selectedCourses.includes(course.id)) {
                                    const index = selectedCourses.indexOf(course.id);
                                    selectedCourses.splice(index, 1);
                                } else {
                                    selectedCourses.push(course.id);
                                }
                            }
                        
                            form.setValue("course", selectedCourses as any); // Type assertion here
                        }}
                        >
                          {`${course.code} - ${course.name}`}
                        </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {accountType === "teacher" && (
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="CEO at Hooli" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="mt-6 col-span-2">
          Register
        </Button>
      </form>
    </Form>
  );
}
