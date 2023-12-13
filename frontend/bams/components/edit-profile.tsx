"use client";

import { useSession } from "next-auth/react";
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

// ... (other imports)

type backEndErrors = {
    [key: string]: string[];
};

const formSchema = z.object({
    email: z.string().email().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().min(13).max(13).optional(),
    dob: z.date().optional(),
    nationality: z.string().max(2).optional(),
    accountType: z.enum(["student", "teacher"]),
    student_id: z.string().optional().optional(),
    courses: z.array(z.string()).optional().optional(),
    designation: z.string().optional().optional(),
});

async function fetchUserProfile(email?: string | null) {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-profile?email=${email}`
    );
    return data;
}

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

export default function EditProfileForm() {
    const { toast } = useToast();
    const session = useSession();

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
        data: userProfileData,
        isLoading: isUserProfileLoading,
        isError: isUserProfileError,
    } = useQuery({
        queryKey: ["user-profile", session?.data?.user.email],
        queryFn: () => fetchUserProfile(session?.data?.user.email),
        enabled: !!session, // Only fetch data if the session is available
    });



    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
    });


    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            const email = session?.data?.user.email;
            return axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/update-profile?email=${email}`, values);
        },
        onSuccess: (data) => {
            console.log(data);
            toast({
                title: "Profile updated.",
                description: `Successfully updated profile.`,
            });
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
                    title: "Profile update failed.",
                    description: `Failed to update profile. ${errors}`,
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
            courses: values.courses,
            accountType: session?.data?.user.role as "student" | "teacher",
        };

        console.log("Form Submitted with values:", formattedValues);

        // mutation.mutate(formattedValues);
    };


    if (isUserProfileLoading && isLoadinCountries && isLoadingCourse) {
        return <Loader2 height="100px" width="100px" className="animate-spin" />;
    } else if (isUserProfileError || isErrorCountries || isErrorCourse) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center">
                <Ban color="#ff0000" height="100px" width="100px" />
                <h1>We are unable to fetch your profile. Please try again later.</h1>
            </div>
        );
    }


    return (
        <Form {...form}>
            <form
                className="grid grid-cols-2 gap-x-12 gap-y-3 text-left"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    defaultValue={userProfileData?.user?.email}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    value={field.value !== undefined ? field.value : userProfileData?.user?.email || ""}
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
                                    value={field.value !== undefined ? field.value : userProfileData?.user?.phone || ""}
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
                                    value={field.value !== undefined ? field.value : userProfileData?.user?.first_name || ""}
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
                                    value={field.value !== undefined ? field.value : userProfileData?.user?.last_name || ""}
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
                                                    : userProfileData?.user?.dob
                                                        ? format(new Date(userProfileData?.user?.dob), "PPP")
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
                                                {
                                                    field.value !== undefined
                                                        ? dataCountries?.find((country) => country.code === field.value)?.name
                                                        : dataCountries?.find((country) => country.code === userProfileData?.user?.nationality)?.name || "Select country"
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
                                            value={field.value !== undefined ? field.value : userProfileData?.student?.student_id || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="courses"
                            defaultValue={userProfileData?.student?.courses}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={dataCourses?.map((item) => ({
                                                value: item.id.toString(),
                                                label: `${item.code} - ${item.name}`,
                                            })) || []}
                                            value={field.value}
                                            onValueChange={(value) => form.setValue("courses", value)}
                                            multiple
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                ) : (
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="CEO at Hooli"
                                        value={field.value !== undefined ? field.value : userProfileData?.teacher?.designation || ""}
                                        onChange={(e) => field.onChange(e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit" className="mt-6 col-span-2">
                    Update Profile
                </Button>
            </form>
        </Form>
    );
}