import { Label } from "@/components/ui/label";
import SignUpForm from "@/components/sign-up-form";
import AbsenteeApplication from "@/components/absentee";
import { AbsenteeList } from "@/components/absentee-list";

export default function Home() {
  return (
    <main className="container grid grid-cols-2 min-h-screen max-h-screen items-center">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="font-bold text-4xl">Welcome to BAMS 👋</h1>
        <Label className="font-normal italic max-w-sm">
          &quot;Best Attendance Management System at the palm of your
          hands&quot;
        </Label>
        <div className="mt-5 flex justify-center">
          <AbsenteeApplication/>
        </div>
      </div>
      <div className="flex justify-center">
        <img className="h-[700px] w-[500px]" src="/image 2.png" />
      </div>

      <div><AbsenteeList/></div>
    </main>
  );
}
