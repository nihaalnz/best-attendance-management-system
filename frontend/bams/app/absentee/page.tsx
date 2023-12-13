"use client";

import AbsenteeApplication from "@/components/absentee";
import { AbsentRequestsTable } from "@/components/absentee-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  columns,
  extraOptions,
  numberColumn,
  studentOptions,
  teacherOptions,
} from "./columns";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";

export default function Home() {
  const session = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["absentee"],
    queryFn: async () => {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/request-absentee`,
        {
          headers: {
            Authorization: `Token ${session?.data?.user.token}`,
          },
        }
      );
      return data.data;
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const role = session.data?.user.role;
  return (
    <main className="container pt-10">
      <div className="grid grid-cols-2 items-start">
        <h1 className="mb-8 font-bold text-4xl col-span-2">
          Absentee Application {`${role === "student" ? "Form" : ""}`}
        </h1>

        {role === "student" && (
          <div className="text-center max-w-lg">
            <div className="mt-8 flex justify-center">
              <AbsenteeApplication />
            </div>
          </div>
        )}

        <div className={`${role !== "student" && "col-span-2"}`}>
          <Label>Your Recent Activity</Label>
          <AbsentRequestsTable
            data={data}
            columns={
              role === "student"
                ? [
                    numberColumn,
                    ...studentOptions.map((option) => option),
                    ...columns,
                  ]
                : role === "teacher" ? [
                    numberColumn,
                    ...teacherOptions.map((option) => option),
                    ...columns,
                    ...extraOptions.map((option) => option),
                  ]
                : [
                    numberColumn,
                    ...teacherOptions.map((option) => option),
                    ...studentOptions.map((option) => option),
                    ...columns,
                    ...extraOptions.map((option) => option),
                  ]
            }
          />
        </div>
      </div>
    </main>
  );
}
