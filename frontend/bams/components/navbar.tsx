"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import UserButton from "./user-button";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-40 w-full backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-10 items-center">
          <div className="flex gap-3 items-center">
            <Sidebar />
            <Link href={siteConfig.logo.url}>
              <div className="flex gap-2 items-center">
                <siteConfig.logo.icon className="h-32 w-32" />
              </div>
            </Link>
          </div>

          {siteConfig.mainNav.map((navItem) => {
            return (
              <Link
                key={navItem.title}
                className="text-sm text-muted-foreground font-medium"
                href={navItem.href}>
                {navItem.title}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserButton name={session.user.name!} />
          ) : (
            <Link href={"/signin"}>
              <Button variant={"secondary"}>Sign In</Button>
            </Link>
          )}
          <ThemeToggle />
          {siteConfig.links.map((navLink) => {
            return (
              <Link key={navLink.title} target="_blank" href={navLink.url}>
                <Button variant={"ghost"} size={"sm"}>
                  <navLink.icon className="h-5 w-5" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
