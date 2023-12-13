"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Attendance = {
  id?: string;
  class_attendance?: number;
  student?: number;
  student_id?: string;
  student_name?: string;
  location: string;
  date: string;
  time: string;
  status: string;

  created_at?: string;
  updated_at?: string;
};

export const columns: ColumnDef<Attendance>[] = [
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
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },

    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("location")}</p>;
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },

    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("time")}</p>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },

    cell: ({ row }) => {
      return <p className="text-center">{row.getValue("date")}</p>;
    },
    filterFn: (rows, id, filterValue) => {
      const { from, to } = filterValue;
      console.log(typeof from, to)
      if (from) {
        if (to) {
          return rows.original.date >= from && rows.original.date <= to;
        }
        return rows.original.date === from;
      }
      // if (from && to) {
      //   // Date range is selected
      //   return rows.original.date >= from && rows.original.date <= to;
      // } 
      // No date filter
      return true;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          className="flex gap-1 items-center justify-center cursor-pointer dark:hover:text-white hover:text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Attendance Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },

    cell: ({ row }) => {
      let status: string = row.getValue("status");
      status = status.charAt(0).toUpperCase() + status.slice(1);
      return <p className="font-bold text-center">{status}</p>;
    },
  },
];
