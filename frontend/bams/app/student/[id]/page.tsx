import { ClassTable } from "@/components/class-table";
import { Attendance, columns } from "./columns";
import axios from "axios";
import { auth } from "@/auth";

async function getData(courseId: number, token: string): Promise<Attendance[]> {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/student/${courseId}/course-attendance`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data.data;
}

export default async function AttendanceMarkPage({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: { [key: string]: string };
}) {
  const session = await auth();
  const data = await getData(params.id, session?.user?.token!);
  const filteredData = data.map(
    ({
      id,
      student_id,
      student_name,
      created_at,
      updated_at,
      class_attendance,
      student,
      ...rest
    }) => rest
  );

  return (
    <div className="container mx-auto max-w-4xl mb-10">
      <h1 className="text-4xl font-bold">
        Attendance {searchParams?.code && <span>for {searchParams?.code}</span>}
      </h1>
      <div className="mx-auto max-w-4xl mb-10 mt-5">
        <ClassTable
          courseCode={searchParams?.code ?? ""}
          columns={columns}
          data={filteredData}
        />
      </div>
    </div>
  );
}
