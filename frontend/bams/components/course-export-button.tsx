"use client";

import {
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import ExcelButton from "@/components/excel-button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

async function fetchData(courseId: string, date?: any) {
  if (date) {
    date = {
      from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
    };
  }
  console.log("fetching...");
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/generate-report/${courseId}`,
    {
      params: {
        ...date,
      },
    }
  );

  return data.data;
}

interface DataExportProps {
  courseId: string;
  courseCode: string;
  date: DateRange | undefined;
}

export function ExportCourseData({
  courseId,
  courseCode,
  date,
}: DataExportProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["courseExport", courseId, date?.from, date?.to],
    queryFn: async () => await fetchData(courseId, date),
  });

  const columns = data
    ? Object.keys(data[0]).map((key) => ({
        header: key,
        accessorKey: key,
      }))
    : [];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (isLoading) return <div>Loading...</div>;
  console.log(courseCode)
  return (
    // @ts-ignore
    <ExcelButton className="self-end" table={table} filename={courseCode}>
      Export All Class
    </ExcelButton>
  );
}
