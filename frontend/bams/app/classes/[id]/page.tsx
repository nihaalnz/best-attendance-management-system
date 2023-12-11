import { DataTable } from "@/components/data-table";
import { Student, columns } from "./columns";
import axios from "axios";
import { auth } from "@/auth";
import { ClassStatusTable } from "@/components/class-status-table";

async function getData(classId: number, token: string): Promise<Student[]> {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attendance/${classId}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data.data;
}

export default async function ClassAttendancePage({
  params,
}: {
  params: { id: number };
}) {
  const session = await auth();
  const data = await getData(params.id, session?.user?.token!);

  return (
    <div className="container mx-auto max-w-4xl mb-10">
      <h1 className="text-4xl font-bold">Attendance Statuses</h1>
      <div className="mx-auto max-w-4xl mb-10 mt-5">
        <ClassStatusTable columns={columns} classId={params.id.toString()} data={data} />
      </div>
    </div>
  );
}
