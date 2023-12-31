"use client";

import CourseCard from "@/components/course-card";
import AddCourseDiaglog from "@/components/course-dialog";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

async function getUserCourses(token: string) {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user-courses`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data.data;
}

export default function Mark() {
  const session = useSession();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await getUserCourses(session?.data?.user.token!);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        {session?.data?.user?.role == "admin" && <AddCourseDiaglog />}
      </div>
      <div className="mt-10">
        <Label>Total result(s): {data?.length}</Label>

        <div className="grid grid-cols-4 gap-11 mt-5">
          {data?.map((item: any) => (
            <CourseCard
              id={item.id}
              courseCode={item.code}
              courseName={item.name}
              description={item.description}
              tutors={item.tutor_names}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
