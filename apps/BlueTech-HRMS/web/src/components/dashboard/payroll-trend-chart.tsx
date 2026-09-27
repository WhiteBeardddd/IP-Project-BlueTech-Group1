"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, ChartCard, ChartTooltip, GRID } from "./chart-parts";
import { useApi } from "@/lib/use-api";
import { formatPeso, formatPesoCompact } from "@/lib/format";
import { SINGLE_SERIES } from "@/lib/status";
import type { PayrollTrendPoint } from "@/lib/types";

export default function PayrollTrendChart() {
  const { data, loading } = useApi<PayrollTrendPoint[]>("/payroll/trend");
  const points = data ?? [];

  return (
    <ChartCard
      title="Payroll Trend"
      meta="Last 6 months"
      loading={loading}
      isEmpty={points.length === 0}
      emptyTitle="No payroll generated yet"
      emptyMessage="Total net payroll per month will chart here once payroll is generated."
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...GRID} />
          <XAxis dataKey="month" {...AXIS} />
          <YAxis {...AXIS} width={56} tickFormatter={formatPesoCompact} />
          <Tooltip
            cursor={{ stroke: "#d5e1d9", strokeWidth: 1 }}
            content={(props) => <ChartTooltip {...props} formatValue={formatPeso} />}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Net payroll"
            stroke={SINGLE_SERIES}
            strokeWidth={2}
            fill={SINGLE_SERIES}
            fillOpacity={0.1}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
