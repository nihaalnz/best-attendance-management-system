import { Icons } from "./icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function UserButton({name, role}: {name: string, role: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
        <Icons.user />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name} ({role})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link href={"/show-profile"}>Profile</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link href={"/api/auth/signout"}>Sign Out</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
