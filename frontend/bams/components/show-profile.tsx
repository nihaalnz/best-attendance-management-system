"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Countries, Courses } from "@/lib/types";



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

export default function ShowProfileCard() {
    const session = useSession();
    const form = useForm();

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
    data: dataUsers,
    isLoading: isLoadinUsers,
    isError: isErrorUsers,
} = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUsers,
});

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
  
    if (isLoadinUsers) {
      return <Loader2 height="100px" width="100px" className="animate-spin" />;
    } else if (isErrorUsers) {
      return (
        <div className="flex flex-col gap-2 justify-center items-center">
          <Ban color="#ff0000" height="100px" width="100px" />
          <h1>We are unable to fetch your profile. Please try again later.</h1>
        </div>
      );
    }
    console.log("student values:",dataUsers?.student);
    return (
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-left">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Email Address</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{dataUsers?.user?.email}</p>
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
                      <FormLabel className="text-xl">Contact Number</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{dataUsers?.user?.phone}</p>
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
                      <FormLabel className="text-xl">First Name</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{dataUsers?.user?.first_name}</p>
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
                      <FormLabel className="text-xl">Last Name</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{dataUsers?.user?.last_name}</p>
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
                      <FormLabel className="text-xl">Date of Birth</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{format(
                            new Date(dataUsers?.user?.dob),
                            "PPP"
                          )}
                        </p>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Nationality</FormLabel>
                      <FormControl>
                        <p className="text-base py-2">{dataCountries?.find((country) => country.code === dataUsers?.user?.nationality)?.name}
                        </p>
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
                          <FormLabel className="text-xl">Student ID</FormLabel>
                          <FormControl>
                            <p className="text-base py-2" >{dataUsers?.student?.student_id}
                            </p>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="courses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl">Course</FormLabel>
                          <FormControl>
                          <p className="text-base py-2" >{dataUsers?.student?.course_names}
                            </p>
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
                        <FormLabel className="text-xl">Designation</FormLabel>
                        <FormControl>
                            <p className="text-base py-2">
                          {dataUsers?.teacher?.designation}
                          </p>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </Form>
          </CardContent>
        </Card>
      );
    }