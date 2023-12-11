"use client";

import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import { FileText } from "lucide-react";
import { ReactNode } from "react";
import { utils, writeFile } from "xlsx";

function generateExcel(table: Table<any>, filename: string) {
  const epoch = new Date().getTime();

  const wb = utils.book_new();
  const ws = utils.json_to_sheet(
    table.getSortedRowModel().flatRows.map((row) => row.original)
  );
  utils.book_append_sheet(wb, ws, filename);
  writeFile(wb, `${filename}_${epoch}.xlsx`);
}

export default function ExcelButton({
  table,
  filename,
  children,
  ...props
}: {
  children: ReactNode;
  table: Table<any>;
  filename: string;
}) {
  return (
    <Button onClick={() => generateExcel(table, filename)} {...props}>
      <FileText className="mr-2" height="20px" /> {children}
    </Button>
  );
}
