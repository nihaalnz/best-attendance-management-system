"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export type Student = {
  student_id: string;
  name: string;
};

export function getColumns(
  attendanceStatus: {},
  setAttendanceStatus: Dispatch<SetStateAction<{}>>
) {
  const columns = [
    {
      header: ({ column }: { column: any }) => {
        return <p className="text-center">No.</p>;
      },
      id: "id",
      cell: ({ row, table }: { row: any; table: any }) =>
        <p className="text-center">{(table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1}</p>
    },
    {
      accessorKey: "student_id",
      // header: "Student ID",
      header: ({ column }: { column: any }) => {
        return (
          <div
            className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Student ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },

      cell: ({ row }: { row: any }) => {
        return <p className="text-center">{row.getValue("student_id")}</p>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }: { column: any }) => {
        return (
          <div
            className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Student Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },

      cell: ({ row }: { row: any }) => {
        return <p className="text-center">{row.getValue("name")}</p>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: any }) => {
        return <p className="text-center">Status</p>;
      },
      cell: ({ row }: { row: any }) => {
        const studentId: string = row.getValue("student_id");
        const statusValue =
          attendanceStatus[studentId as keyof typeof attendanceStatus] || ""; // Default to an empty string if not found

        return (
          <Select
            value={statusValue}
            onValueChange={(value) =>
              setAttendanceStatus((prevStatus) => ({
                ...prevStatus,
                [studentId]: value,
              }))
            }>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="tardy">Tardy</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  return columns;
}
