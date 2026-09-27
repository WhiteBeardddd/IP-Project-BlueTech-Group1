"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, ChartCard, ChartTooltip, GRID } from "./chart-parts";
import { useApi } from "@/lib/use-api";
import { formatDate, formatPeso, formatPesoCompact } from "@/lib/format";
import { SINGLE_SERIES } from "@/lib/status";
import type { DepartmentPayroll } from "@/lib/types";

export default function PayrollByDepartmentChart() {
  const { data, loading } = useApi<DepartmentPayroll>("/payroll/by-department");
  const departments = data?.departments ?? [];

  return (
    <ChartCard
      title="Payroll Cost by Department"
      meta={data?.date ? formatDate(data.date, { month: "long", year: "numeric" }) : "Latest payroll period"}
      loading={loading}
      isEmpty={departments.length === 0}
      emptyTitle="No department payroll yet"
      emptyMessage="Each department's net payroll for the latest period will chart here."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={departments} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="department" {...AXIS} interval={0} />
          <YAxis {...AXIS} width={56} tickFormatter={formatPesoCompact} />
          <Tooltip cursor={{ fill: "#f3f6f4" }} content={(props) => <ChartTooltip {...props} formatValue={formatPeso} />} />
          <Bar dataKey="total" name="Net payroll" fill={SINGLE_SERIES} maxBarSize={24} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
