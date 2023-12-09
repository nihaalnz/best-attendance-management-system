"use client";
import ClassCard from "@/components/class-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addDays, format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import AddClassDialog from "@/components/class-dialog";

async function getClasses(token: string, options: any) {
  if (options) {
    options = {
      course: options.course || undefined,
      date: {
        from: options.date?.from
          ? format(options.date.from, "yyyy-MM-dd")
          : undefined,
        to: options.date?.to
          ? format(options.date.to, "yyyy-MM-dd")
          : undefined,
      },
    };
  }
  const data = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/classes`, {
    params: {
      ...options,
    },
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
}
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
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 3),
    to: addDays(new Date(), 20),
  });

  const [course, setCourse] = useState(courseId);

  const session = useSession();
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["classes"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return await getClasses(session?.data?.user.token!, { date, course });
    },
  });
  const {
    data: courseData,
    isError: isErrorCourse,
    isLoading: isLoadingCourse,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await getUserCourses(session?.data?.user.token!);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Classes</h1>
        {session?.data?.user.role != "student" && courseId && (
          <AddClassDialog courseId={courseId!} />
        )}
      </div>
      <div className="mt-10">
        <div className="flex rounded-lg border bg-card text-card-foreground shadow-sm p-5 gap-5 items-center justify-center">
          <div>
            <Label>Choose date</Label>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={3}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label>Choose course</Label>
            {/* @ts-ignore */}
            <Select defaultValue={course && parseInt(course!)}
              onValueChange={setCourse}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Courses" />
              </SelectTrigger>
              <SelectContent>
                {/* @ts-ignore */}
                <SelectItem value={null}>Courses</SelectItem>
                {courseData?.data.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.code} - {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="self-end" onClick={() => refetch()}>
            Filter
          </Button>
        </div>
        <div className="flex gap-10 mt-5 flex-wrap">
          {data?.data.map((item: any) => (
            <ClassCard
              id={item.id}
              courseCode={item.course_code}
              courseName={item.course_name}
              date={item.date}
              startTime={item.start_time}
              endTime={item.end_time}
              location={item.location}
              teacher={item.teacher_name}
              key={item.id}
              isCancelled={item.is_cancelled}
              status={item.attendance_status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
