import { Label } from "@/components/ui/label";
import LogInForm from "@/components/login-form";

export default function Home() {
  return (
    <main className="container grid grid-cols-2 min-h-screen max-h-screen items-center">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="font-bold text-4xl">Welcome to BAMS 👋</h1>
        <Label className="font-normal italic">
          &quot;Education is the passport to the future, for tomorrow belongs to
          those who prepare for it today.&quot;
        </Label>
        <div className="mt-5 flex justify-center">
          <LogInForm />
        </div>
      </div>
      <div className="flex justify-center">
        <img className="h-[700px] w-[500px]" src="/image 4.png" />
      </div>
    </main>
  );
}
