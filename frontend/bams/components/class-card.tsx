"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ClassCard({
  id,
  courseCode,
  courseName,
  location,
  date,
  startTime,
  endTime,
  teacher,
  isCancelled,
  status,
}: {
  id: number;
  courseCode: string;
  courseName: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  teacher: string;
  isCancelled: boolean;
  status?: string;
}) {
  const router = useRouter();
  const session = useSession();
  return (
    <Card className="p-3 flex flex-col justify-between max-w-[300px] hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors">
      <CardHeader>
        {isCancelled && <Badge className="self-start" variant={"destructive"}>Cancelled</Badge>}
        {status && <Badge className="self-start" variant={`${status === 'Present' ? 'default': 'destructive'}`}>{status}</Badge>}
        <CardTitle
          className={`${
            session?.data?.user?.role != "student" &&
            "cursor-pointer underline decoration-4 underline-offset-8 decoration-transparent hover:decoration-blue-300 transition-all ease-in"
          }`}
          onClick={() => {
            session?.data?.user?.role != "student" &&
              router.push(`/attendance/${id}`);
          }}>
          {courseCode}
        </CardTitle>
        <CardDescription>{courseName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Location: {location}</p>
        <p>Date: {date}</p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
      </CardContent>
      <CardFooter>
        <p className="font-bold">{teacher}</p>
      </CardFooter>
    </Card>
  );
}
