"use client";

import { Countries, Courses, Users } from "@/lib/types";
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
import { Textarea } from "./ui/textarea";

type backEndErrors = {
    [key: string]: string[];
};



async function fetchCourses() {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/courses`
    );
    return data;
}

async function fetchCountries() {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/countries`
    );
    return data;
}


export default function EditForm() {

    const formSchema = z
        .object({
            email: z.string().email().optional(),
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            phone: z.string().min(13).max(13).optional(),
            dob: z.date().optional(),
            nationality: z.string().max(2).optional(),
            accountType: z.enum(["student", "teacher"]),
            student_id: z.string().optional().optional(),
            course: z.string().optional(),
            designation: z.string().optional(),
        });
    const { toast } = useToast();
    const session = useSession();

    const fetchUsers = async () => {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/user-profile`,
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
        data: dataCountries,
        isLoading: isLoadinCountries,
        isError: isErrorCountries,
    } = useQuery<Countries>({
        queryKey: ["countries"],
        queryFn: fetchCountries,
    });
    const {
        data: dataUsers,
        isLoading: isLoadinUsers,
        isError: isErrorUsers,
    } = useQuery({
        queryKey: ["user-profile"],
        queryFn: fetchUsers,
    });
    // console.log(dataCountries)
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
    });

    console.log("UserData:", dataUsers);
    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/user-profile/`,
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
                title: "Account updated.",
                description: `Successfully updated account.`,
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
                    title: "Account updation failed.",
                    description: `Failed to update account. ${errors}`,
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
        // form.reset();
        mutation.mutate(values);
    };



    if (isLoadinCountries || isLoadingCourse || isLoadinUsers) {
        return <Loader2 height="100px" width="100px" className="animate-spin" />;
    } else if (isErrorCourse || isErrorCountries || isErrorUsers) {
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
                                    value={field.value !== undefined ? field.value : dataUsers?.user?.email || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
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
                                <Input type="phone" placeholder="+971501087623"
                                    value={field.value !== undefined ? field.value : dataUsers?.user?.phone || ""}
                                    onChange={(e) => field.onChange(e.target.value)} />
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
                                <Input type="text" placeholder="Gavin"
                                    value={field.value !== undefined ? field.value : dataUsers?.user?.first_name || ""}
                                    onChange={(e) => field.onChange(e.target.value)} />
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
                                <Input type="text" placeholder="Belson"
                                    value={field.value !== undefined ? field.value : dataUsers?.user?.last_name || ""}
                                    onChange={(e) => field.onChange(e.target.value)} />
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
                                            )}
                                        >
                                            {
                                                field.value !== undefined
                                                    ? format(new Date(field.value), "PPP")
                                                    : dataUsers?.user?.dob
                                                        ? format(new Date(dataUsers?.user?.dob), "PPP")
                                                        : <span>Pick a date</span>
                                            }
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    avoidCollisions={false}
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <ScrollArea className="h-80">
                                        <Calendar
                                            mode="single"
                                            defaultMonth={field.value}
                                            selected={field.value}
                                            onSelect={field.onChange}
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
                                                {
                                                    field.value !== undefined
                                                        ? dataCountries?.find((country) => country.code === field.value)?.name
                                                        : dataCountries?.find((country) => country.code === dataUsers?.user?.nationality)?.name || "Select country"
                                                }
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
                                                    {dataCountries ? (
                                                        dataCountries.map((country) => (
                                                            <CommandItem
                                                                className=""
                                                                value={country.name}
                                                                key={country.code}
                                                                onSelect={() => {
                                                                    form.setValue("nationality", country.code);

                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        country.code === form.watch("nationality") ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {country.name}
                                                            </CommandItem>
                                                        ))
                                                    ) : (
                                                        <CommandEmpty>No language found.</CommandEmpty>
                                                    )}
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


                {session?.data?.user.role === "student" ? (
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
                                            value={field.value !== undefined ? field.value : dataUsers?.student?.student_id || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
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
                                    <FormLabel>My Courses</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Description" defaultValue={dataUsers?.student?.course_names} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            defaultValue={dataUsers?.student.course_names}
                        />
                    </>
                ) : session?.data?.user.role === "teacher" ? (
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="CEO at Hooli"
                                        value={field.value !== undefined ? field.value : dataUsers?.teacher?.designation || ""}
                                        onChange={(e) => field.onChange(e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <></>
                )
                }
                <Button
                    type="button"  // Set the type to "button" to prevent form submission
                    className="mt-6 col-span-2"
                    onClick={() => handleSubmit(form.getValues())}
                >
                    Update
                </Button>
            </form>
        </Form>
    );
}
