"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Student = {
  student_id: string;
  student_name: string;
  status: string;
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

    cell: ({ row }: { row: any }) => {
      return <p className="text-center">{row.getValue("student_id")}</p>;
    },
  },
  {
    accessorKey: "student_name",
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
      return <p className="text-center">{row.getValue("student_name")}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <p className="text-center">Status</p>;
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const fixedStatus: string = status.charAt(0).toUpperCase() + status.slice(1);
      return <p className="text-center font-bold">{fixedStatus}</p>;
    },
  },
];
