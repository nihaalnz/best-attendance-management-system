import { auth } from "@/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Courses from "@/components/courses-form";
import { Label } from "@/components/ui/label";
import { CourseList } from "@/components/courses-list";

export default async function Home() {
  const session = await auth();
  return (
    <main className="container">
      <div className="text-center">
        <h1 className="font-bold text-5xl">
          Best Attendance Management System
        </h1>
      </div>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="head-text text-3xl">Add a New Course</AccordionTrigger>
          <AccordionContent>
          <div className="container grid grid-cols-2 items-center">
            <div className="text-center max-w-lg mx-auto">
              <h1 className="head-text text-2xl">Enter Course Information</h1>
              <div className="mt-5 flex justify-center">
                <Courses />
              </div>
            </div>
            <div className="flex justify-center">
              <img className="h-[500px] w-[300px]" src="/image 4.png" />
            </div>
          </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="head-text text-3xl">View Existing Courses</AccordionTrigger>
          <AccordionContent>
            <CourseList/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

"use client";

import CourseCard from "@/components/course-card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

async function getUserCourses(token: string) {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user-courses`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data;
}

export default function Mark() {
  const session = useSession();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await getUserCourses(session?.data?.user.token!);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Courses</h1>
      <div className="mt-10">
        <div className="flex gap-6 mt-5">
          {data?.data.map((item: any) => (
            <CourseCard
              id={item.id}
              courseCode={item.code}
              courseName={item.name}
              description={item.description}
              tutors={item.tutor_names}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
