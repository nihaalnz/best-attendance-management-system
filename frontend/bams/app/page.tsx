"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import SignUpForm from "@/components/sign-up-form";

export default function Home() {
  return (
    <main className="container grid grid-cols-2 min-h-screen max-h-screen items-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Welcome to BAMS 👋</h1>
        <Label className="font-normal italic">
        &quot;Best Attendance Management System at the palm of your hands&quot;
        </Label>
        <div className="mt-5 flex justify-center">
          <SignUpForm />
        </div>
      </div>
      <div className="flex justify-center">
        <img className="h-[700px] w-[500px]" src="/image 4.png" />
      </div>
    </main>
  );
}
