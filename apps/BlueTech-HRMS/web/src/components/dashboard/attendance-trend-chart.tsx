"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, ChartCard, ChartTooltip, GRID } from "./chart-parts";
import { useApi } from "@/lib/use-api";
import { formatDate } from "@/lib/format";
import { SERIES } from "@/lib/status";
import type { AttendanceTrendPoint } from "@/lib/types";

// Order matches the validated palette order in SERIES.
const LINES = [
  { key: "present", label: "Present", color: SERIES.present },
  { key: "late", label: "Late", color: SERIES.late },
  { key: "onLeave", label: "On Leave", color: SERIES.onLeave },
  { key: "absent", label: "Absent", color: SERIES.absent },
] as const;

export default function AttendanceTrendChart() {
  const { data, loading } = useApi<AttendanceTrendPoint[]>("/attendance/trend");
  const points = data ?? [];

  return (
    <ChartCard
      title="Attendance Trend"
      meta="Last 30 days"
      loading={loading}
      isEmpty={points.length === 0}
      emptyTitle="No attendance recorded yet"
      emptyMessage="Daily Present, Late, On Leave, and Absent counts will chart here as attendance is recorded."
      legend={LINES.map(({ label, color }) => ({ label, color }))}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="date" {...AXIS} minTickGap={24} tickFormatter={(d: string) => formatDate(d, { month: "short", day: "numeric" })} />
          <YAxis {...AXIS} allowDecimals={false} width={40} />
          <Tooltip
            cursor={{ stroke: "#d5e1d9", strokeWidth: 1 }}
            content={(props) => <ChartTooltip {...props} formatLabel={(d) => formatDate(d, { weekday: "short", month: "short", day: "numeric" })} />}
          />
          {LINES.map(({ key, label, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
