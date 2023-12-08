"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Student = {
  student_id: string;
  name: string;
  attendanceRatio: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    header: ({ column }) => {
      return <p className="text-center">No.</p>;
    },
    id: "id",
    cell: ({ row, table }: { row: any; table: any }) => (
      <p className="text-center">
        {(table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
          1}
      </p>
    ),
  },
  {
    accessorKey: "student_id",
    // header: "Student ID",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("student_id")}</p>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Student Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("name")}</p>;
    },
  },
  {
    accessorKey: "attendance_ratio",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Attendance Ratio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },

    cell: ({ row }) => {
      return (
        <p className="font-bold text-center">
          {row.getValue("attendance_ratio")}
        </p>
      );
    },
  },
];
