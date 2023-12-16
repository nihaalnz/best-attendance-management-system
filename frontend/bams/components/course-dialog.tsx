import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import CourseForm from "./courses-form";
import { useState } from "react";

export default function AddCourseDiaglog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>
            Add new courses here. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <CourseForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
