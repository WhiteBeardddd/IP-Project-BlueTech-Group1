"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, ChartCard, ChartTooltip } from "./chart-parts";
import { useApi } from "@/lib/use-api";
import { SINGLE_SERIES } from "@/lib/status";
import type { DepartmentHeadcount } from "@/lib/types";

// Horizontal bars rather than a pie: comparing headcounts is a magnitude job, and one
// hue keeps any number of departments readable without a colour legend.
export default function DepartmentHeadcountChart() {
  const { data, loading } = useApi<DepartmentHeadcount[]>("/employees/departments");
  const rows = [...(data ?? [])].sort((a, b) => b.count - a.count);

  return (
    <ChartCard
      title="Employees by Department"
      meta="All statuses"
      loading={loading}
      isEmpty={rows.length === 0}
      emptyTitle="No employees yet"
      emptyMessage="Headcount per department will chart here once employees are added."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#edf0ee" horizontal={false} />
          <XAxis type="number" {...AXIS} allowDecimals={false} />
          <YAxis type="category" dataKey="department" {...AXIS} width={120} />
          <Tooltip cursor={{ fill: "#f3f6f4" }} content={(props) => <ChartTooltip {...props} />} />
          <Bar dataKey="count" name="Employees" fill={SINGLE_SERIES} barSize={18} radius={[0, 4, 4, 0]}>
            <LabelList dataKey="count" position="right" fill="#3f4b44" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
