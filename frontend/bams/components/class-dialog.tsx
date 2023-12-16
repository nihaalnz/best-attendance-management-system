import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClassForm from "@/components/class-form";
import { useState } from "react";

export default function AddCourseDialog( {courseId}: {courseId: string}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
          <DialogDescription>
            Add classes to the course. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <ClassForm setOpen={setOpen} courseId={courseId} />
      </DialogContent>
    </Dialog>
  );
}
