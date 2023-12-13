import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditClass from "@/components/class-edit";

export function ClassEditDialog({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Make changes to class here. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditClass setOpen={setOpen} classId={classId} />
      </DialogContent>
    </Dialog>
  );
}
