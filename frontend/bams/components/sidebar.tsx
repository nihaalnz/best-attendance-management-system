import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"}>
          <Menu height={"20px"} width={"20px"} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-4 min-h-full justify-between">
          <div className="flex flex-col gap-4">
            <Button variant={"outline"}>Dashboard</Button>
            <Button variant={"outline"}>View Attendance</Button>
            <Button variant={"outline"}>View Classes</Button>
            <Button variant={"outline"}>View Result</Button>
            <Button variant={"outline"}>Absentee Application</Button>
          </div>
          <Link className="self-end" href="/api/auth/signout">
            <Button variant={"outline"}>
              <LogOut height="20px" width="20px" />
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
