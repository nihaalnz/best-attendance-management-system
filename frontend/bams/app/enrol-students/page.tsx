import { Label } from "@/components/ui/label";
import SignUpForm from "@/components/sign-up-form";
import EditProfileForm from "@/components/edit-profile";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StudentEnrollment from "@/components/enrol-students";

export default function Home() {
  return (
    <main className="container flex justify-center items-center h-screen">
      <div className="text-center max-w-lg mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enroll Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentEnrollment />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}