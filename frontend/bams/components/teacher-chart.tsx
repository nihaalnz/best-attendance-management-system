import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./ui/card";
import { format } from "date-fns";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: any;
  label: any;
}) {
  if (active && payload && payload.length) {
    const dateLabel = format(new Date(label), "PPP");
    return (
      <Card className="p-6 backdrop-blur-xl bg-transparent">
        <p className="label">{dateLabel}</p>
        {payload.map((entry: any, i: number) => {
          return (
            <p key={i}>
              <span className="font-bold">
                {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}
              </span>{" "}
              - {entry.value}
            </p>
          );
        })}
      </Card>
    );
  }
}

export function TeacherCharts({ data }: { data: any }) {
  return (
    <Card className="p-6">
      <p className="text-xl my-3">Attendance status from previous classes</p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            cursor={false}
            // @ts-ignore
            content={(props) => <ChartTooltip {...props} />}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="absent" stroke="#82ca9d" />
          <Line type="monotone" dataKey="tardy" stroke="#d817df" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
