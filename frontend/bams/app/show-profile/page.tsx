import { Label } from "@/components/ui/label";
import SignUpForm from "@/components/sign-up-form";
import EditProfileForm from "@/components/edit-profile";
import ShowProfileCard from "@/components/show-profile";

export default function Home() {
    return (
      <main className="container flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="mx-auto">
            <ShowProfileCard />
          </div>
        </div>
      </main>
    );
  }
