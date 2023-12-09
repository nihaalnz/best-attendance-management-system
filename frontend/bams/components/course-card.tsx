"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

export default function CourseCard({
  id,
  courseCode,
  courseName,
  description,
  tutors,
}: {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  tutors: string;
}) {
  const router = useRouter();
  const session = useSession();
  return (
    <Card className="p-3 flex flex-col justify-between max-w-[300px] max-h-[400px] hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <span
              className="cursor-pointer underline decoration-4 underline-offset-8 decoration-transparent hover:decoration-blue-300 transition-all ease-in"
              onClick={() => router.push(`/classes?course_id=${id}`)}>
              {courseCode}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="translate-x-1/2 -translate-y-1/2">
                <div className="px-3 hover:bg-accent py-1 rounded-md">
                  <MoreHorizontal />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Additional Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session?.data?.user?.role != "student" ? (
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/courses/${id}?code=${courseCode}`)
                    }>
                    View Students
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/student/${id}?code=${courseCode}`)
                    }>
                    View Attendances
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem disabled>---------------</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription>{courseName}</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[150px] overflow-hidden overflow-ellipsis">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit modi
        sequi sapiente, dignissimos neque quam repellat ut non minus,
        exercitationem itaque saepe quasi voluptas minima. Amet minima neque
        facilis consequuntur!
      </CardContent>
      <CardFooter>
        <p className="font-bold mt-4">{tutors}</p>
      </CardFooter>
    </Card>
  );
}
