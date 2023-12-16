import { useState } from "react";
import EditCourse from "@/components/course-edit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function CourseEditDialog({ courseId }: { courseId: string }) {
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
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Make changes to course here. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditCourse setOpen={setOpen} courseId={courseId} />
      </DialogContent>
    </Dialog>
  );
}
