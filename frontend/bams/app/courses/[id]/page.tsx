"use client";

import { StudentTable } from "@/components/student-table";
import { Student } from "@/lib/types";
import axios from "axios";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { addDays, format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";

async function getData(
  courseId: number,
  token: string,
  options: any
): Promise<Student[]> {
  if (options) {
    options = {
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
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/course/${courseId}/students-attendance`,
    {
      params: {
        ...options,
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data.data;
}

export default function AttendanceMarkPage({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: { [key: string]: string };
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 3),
    to: addDays(new Date(), 20),
  });

  const session = useSession();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["students", params.id],
    queryFn: async () =>
      await getData(params.id, session?.data?.user?.token!, { date }),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto max-w-4xl mb-10">
      <h1 className="text-4xl font-bold">
        Students {searchParams?.code && <span>in {searchParams?.code}</span>}
      </h1>
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
          <Button onClick={() => refetch()}>Filter</Button>
        </div>
      </div>
      <div className="mx-auto max-w-4xl mb-10 mt-5">
        <StudentTable
          courseId={params.id}
          courseCode={searchParams?.code ?? ""}
          data={data!}
        />
      </div>
    </div>
  );
}
