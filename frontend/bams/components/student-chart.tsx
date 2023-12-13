import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./ui/card";
import { format } from "date-fns";

function tickFormatter(value: number) {
  switch (value) {
    case 3:
      return "Present";
    case 2:
      return "Tardy";
    case 1:
      return "Absent";
    default:
      return "";
  }
}

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
          const status =
            entry.value === 3
              ? "Present"
              : entry.value === 2
              ? "Tardy"
              : "Absent";
          return (
            <p key={i}>
              <span className="font-bold">{entry.dataKey}</span> - {status}
            </p>
          );
        })}
      </Card>
    );
  }
}

export function StudentChart({
  data,
  courseCodes,
}: {
  data: any;
  courseCodes: any;
}) {
  const colors = ["#8884d8", "#82ca9d", "#d817df"]

  return (
    <Card className="p-6">
      <p className="text-xl my-3">Attendance status from previous classes</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="date" />
          <YAxis ticks={[1, 2, 3]} tickFormatter={tickFormatter} />
          <Tooltip
            cursor={false}
            // @ts-ignore
            content={(props) => <ChartTooltip {...props} />}
          />
          <Legend />
          {courseCodes.map((courseCode: any, i: number) => (
            <Bar
              key={i}
              dataKey={courseCode}
              fill={`${colors[i]}`} // Random color for each course
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
