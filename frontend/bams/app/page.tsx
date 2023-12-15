"use client";
import { StudentChart } from "@/components/student-chart";
import { TeacherCharts } from "@/components/teacher-chart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";

async function fetchData(session: any) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/analytics/${
      session.data?.user?.role === "student"
        ? session.data?.user?.role
        : "teacher"
    }`,
    {
      headers: {
        Authorization: `Token ${session?.data?.user.token}`,
      },
    }
  );
  return data;
}
export default function Home() {
  const session = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", session.data?.user?.role],
    queryFn: async () => await fetchData(session),
  });
  if (isLoading) return <div>Loading...</div>;
  const courseCodes = [
    // @ts-ignore
    ...new Set(
      data.flatMap((entry: any) =>
        Object.keys(entry).filter((key) => key !== "date")
      )
    ),
  ];

  return (
    <main className="container">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">
          Welcome back,{" "}
          {/* <span className="font-extrabold bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 dark:from-indigo-200 dark:via-red-200 dark:to-yellow-100 text-transparent bg-clip-text bg-300% animate-gradient">
            {session?.data?.user?.name}
          </span> */}
        
        <TypeAnimation className="text-4xl font-extrabold bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 dark:from-indigo-200 dark:via-red-200 dark:to-yellow-100 text-transparent bg-clip-text bg-300% animate-gradient" sequence={[
          `${session?.data?.user?.name}!`,
          1000,
          'have a good day today!',
          1000
        ]}
        repeat={Infinity} /></h1>
        {/* {session?.data?.user ? (
          <div>
            <p>Logged in as: {session?.data.user.email}</p>
            <p>Role: {session?.data.user.role}</p>
            <p>Token: {session?.data.user.token}</p>
          </div>
        ) : (
          <div>
            <p>Not logged in yet!</p>
          </div>
        )} */}
      </div>

      {session.data?.user?.role !== "student" ? (
        <TeacherCharts data={data} />
      ) : (
        <StudentChart data={data} courseCodes={courseCodes} />
      )}
    </main>
  );
}
