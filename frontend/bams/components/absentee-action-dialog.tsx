import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AbsenteeAction from "./absentee-action-form";
// import EditClass from "@/components/class-edit";

export function AbsenteeActionDialog({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Respond
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Respond to Absentee Request</DialogTitle>
          <DialogDescription>
            Make changes to request here. Click respond when you're done.
          </DialogDescription>
        </DialogHeader>
        <AbsenteeAction setOpen={setOpen} applicationId={applicationId} />
      </DialogContent>
    </Dialog>
  );
}