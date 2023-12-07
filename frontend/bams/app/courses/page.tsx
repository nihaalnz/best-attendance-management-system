"use client";

import CourseCard from "@/components/course-card";
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
  return data;
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
      <h1 className="text-3xl font-bold">Courses</h1>
      <div className="mt-10">
        <div className="flex gap-6 mt-5">
          {data?.data.map((item: any) => (
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
