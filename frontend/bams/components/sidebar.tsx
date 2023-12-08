"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { LogOut, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Sidebar() {
  const { data: session, status } = useSession();
  if (status !== "authenticated") return <></>;
  const role = session?.user?.role;

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
            {role &&
              // @ts-ignore
              siteConfig.sideNav[role].map((item, i) => (
              <Link key={i} href={item.href}>
                <Button variant={"outline"}>
                  <item.icon height="20px" width="20px" className="mr-2" />
                  {item.title}
                </Button>
              </Link>
              ))}
          </div>
          <Link href="/api/auth/signout">
            <Button className="w-full">
              <LogOut className="mr-2" height="20px" width="20px" /> Logout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
