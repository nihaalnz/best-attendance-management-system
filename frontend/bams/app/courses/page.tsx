import { auth } from "@/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Courses from "@/components/courses-form";
import { Label } from "@/components/ui/label";
import { CourseList } from "@/components/courses-list";

export default async function Home() {
  const session = await auth();
  return (
    <main className="container">
      <div className="text-center">
        <h1 className="font-bold text-5xl">
          Best Attendance Management System
        </h1>
      </div>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="head-text text-3xl">Add a New Course</AccordionTrigger>
          <AccordionContent>
          <div className="container grid grid-cols-2 items-center">
            <div className="text-center max-w-lg mx-auto">
              <h1 className="head-text text-2xl">Enter Course Information</h1>
              <div className="mt-5 flex justify-center">
                <Courses />
              </div>
            </div>
            <div className="flex justify-center">
              <img className="h-[500px] w-[300px]" src="/image 4.png" />
            </div>
          </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="head-text text-3xl">View Existing Courses</AccordionTrigger>
          <AccordionContent>
            <CourseList/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}