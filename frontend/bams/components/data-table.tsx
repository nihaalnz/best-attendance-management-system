"use client";

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
  Loader2,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { getColumns } from "@/app/attendance/[id]/columns";

interface DataTableProps<TData, TValue> {
  data: TData[];
  classId: number;
}

function fillAttendance(setAttendanceStatus: any, data: any) {
  const attendanceStatus = {};
  if (data) {
    data.forEach((item: any) => {
      // @ts-ignore
      attendanceStatus[item.student_id] = item.status;
    });
    setAttendanceStatus(attendanceStatus);
  }
}

export function DataTable<TData, TValue>({
  data,
  classId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/${classId}`,
        data
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Attendance Saved!",
        description: data.data,
      });
      router.push("/");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      if (error?.response!.status == 400) {
        toast({
          variant: "destructive",
          title: "Cancelled class!",
          description: error.response.data as string,
        });
      }
      if (error?.response!.status == 500) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Error in the server, please try again later!",
        });
      }
    },
  });

  const {
    data: attendanceData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["attendance", classId],
    queryFn: async () => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/${classId}`
      );
    },
  });
  useEffect(() => {
    if (isSuccess) {
      fillAttendance(setAttendanceStatus, attendanceData?.data);
    }
  }, [attendanceData]);

  const columns = getColumns(attendanceStatus, setAttendanceStatus);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    }
  });

  if (isLoading) return <div>Loading...</div>;
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
        <div className="flex items-center justify-between p-5">
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
          </div>
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              mutation.mutate(attendanceStatus);
            }}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save Attendance"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
