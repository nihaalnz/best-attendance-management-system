import { AbsenteeActionDialog } from "@/components/absentee-action-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

type AbsenteeApplication = {
  tutor_name: string;
  reason_type: string;
  reason: string;
  status: string;
}[];

export const columns: ColumnDef<AbsenteeApplication>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Requsted Date",
    cell: ({ row }) => {
      return <p className="font-bold">{row.getValue("date")}</p>;
    },
    // cell: ({ row }) => {
    //   const status: string = row.getValue("status");
    //   const formatStatus = status.charAt(0).toUpperCase() + status.slice(1);

    //   return (
    //     <Badge
    //       variant={`${
    //         status === "rejected"
    //           ? "destructive"
    //           : status === "pending"
    //           ? "secondary"
    //           : "default"
    //       }`}>
    //       <p className="font-bold">{formatStatus}</p>
    //     </Badge>
    //   );
    // },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const formatStatus = status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <Badge
          variant={`${
            status === "rejected"
              ? "destructive"
              : status === "pending"
              ? "secondary"
              : "default"
          }`}>
          <p className="font-bold">{formatStatus}</p>
        </Badge>
      );
    },
  },
];
export const numberColumn = {
  accessorKey: "sl",
  header: ({ column }: { column: Column<AbsenteeApplication> }) => {
    return <p className="text-center">No.</p>;
  },
  cell: ({
    row,
    table,
  }: {
    row: Row<AbsenteeApplication>;
    table: Table<AbsenteeApplication>;
  }) => (
    <p>
      {(table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1}
    </p>
  ),
};

export const extraOptions = [
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }: { row: Row<AbsenteeApplication> }) => {
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
            <AbsenteeActionDialog applicationId={row.getValue("id")} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const teacherOptions = [
  {
    accessorKey: "student_name",
    header: "Requested By",
  },
  {
    accessorKey: "request_reason",
    header: "Request Reason",
  },
];

export const studentOptions = [
  {
    accessorKey: "tutor_name",
    header: "Requested To",
  },
  {
    accessorKey: "response_reason",
    header: "Response Reason",
  },
];
