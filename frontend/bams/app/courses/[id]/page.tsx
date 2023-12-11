import { StudentTable } from "@/components/student-table";
import { Student, columns } from "./columns";
import axios from "axios";
import { auth } from "@/auth";

async function getData(courseId: number, token: string): Promise<Student[]> {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/course/${courseId}/students-attendance`,
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
  return (
    <div className="container mx-auto max-w-4xl mb-10">
      <h1 className="text-4xl font-bold">
        Students {searchParams?.code && <span>in {searchParams?.code}</span>}
      </h1>
      <div className="mx-auto max-w-4xl mb-10 mt-5">
        <StudentTable courseCode={searchParams?.code ?? ''} columns={columns} data={data} />
      </div>
    </div>
  );
}
