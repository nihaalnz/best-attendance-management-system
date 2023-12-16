import { DataTable } from "@/components/data-table";
import { Student } from "./columns";
import axios from "axios";
import { auth } from "@/auth";

async function getData(classId: number, token: string): Promise<Student[]> {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/students/${classId}`,
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
}: {
  params: { id: number };
}) {
  const session = await auth();
  const data = await getData(params.id, session?.user?.token!);

  return (
    <div className="container mx-auto max-w-4xl mb-10">
      <h1 className="text-4xl font-bold">Mark Attendance</h1>
      <div className="mx-auto max-w-4xl mb-10 mt-5">
        <DataTable classId={params.id} data={data} />
      </div>
    </div>
  );
}
