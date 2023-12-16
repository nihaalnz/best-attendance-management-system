"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StepForwardIcon,
  StepBackIcon,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import ExcelButton from "@/components/excel-button";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  courseId: number;
  courseCode: string;
  data: TData[];
}

export function StudentTable<TData, TValue>({
  courseId,
  courseCode,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const columns: ColumnDef<TData, TValue>[] = [
    {
      header: ({ column }) => {
        return <p className="text-center">No.</p>;
      },
      id: "id",
      cell: ({ row, table }: { row: any; table: any }) => (
        <p className="text-center">
          {(table
            .getSortedRowModel()
            ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) ||
            0) + 1}
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
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
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
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
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
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
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
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/student/${courseId}?student_id=${row.getValue("student_id")}&code=${courseCode}`)
                }>
                View Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="flex items-center justify-end p-5">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to first page</span>
                <StepBackIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to last page</span>
                <StepForwardIcon className="h-4 w-4" />
              </Button>
            </div>
            <ExcelButton table={table} filename={courseCode}>
              Export to Excel
            </ExcelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
