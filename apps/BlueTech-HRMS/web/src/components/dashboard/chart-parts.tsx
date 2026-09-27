"use client";

import type { TooltipContentProps } from "recharts";

// Recessive chrome shared by every chart: hairline solid grid, muted ticks, no axis lines.
export const GRID = { stroke: "#edf0ee", vertical: false } as const;
export const AXIS = { stroke: "#68756d", fontSize: 11, tickLine: false, axisLine: false } as const;

type ChartCardProps = {
  title: string;
  meta?: string;
  loading: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptyMessage: string;
  legend?: { label: string; color: string }[];
  children: React.ReactNode;
};

export function ChartCard({ title, meta, loading, isEmpty, emptyTitle, emptyMessage, legend, children }: ChartCardProps) {
  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">{title}</h3>
        {meta && <span className="card-meta">{meta}</span>}
      </div>
      <div className="card-body">
        {legend && !loading && !isEmpty && (
          <ul className="legend" aria-label="Legend">
            {legend.map(({ label, color }) => (
              <li key={label}><span className="swatch" style={{ background: color }} />{label}</li>
            ))}
          </ul>
        )}
        <div className="chart-frame">
          {loading ? (
            <div className="chart-placeholder" aria-busy="true"><span className="skeleton" style={{ width: "60%" }} /></div>
          ) : isEmpty ? (
            <div className="chart-placeholder" role="status">
              <strong>{emptyTitle}</strong>
              <span>{emptyMessage}</span>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}

type TooltipProps = Partial<TooltipContentProps> & {
  formatLabel?: (label: string) => string;
  formatValue?: (value: number) => string;
};

export function ChartTooltip({ active, payload, label, formatLabel, formatValue = String }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p>{formatLabel ? formatLabel(String(label)) : label}</p>
      <ul>
        {payload.map((entry) => (
          <li key={String(entry.dataKey)}>
            <span className="swatch" style={{ background: entry.color ?? entry.stroke ?? entry.fill }} />
            {entry.name}
            <strong>{formatValue(Number(entry.value ?? 0))}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PanelEmpty({ title, message }: { title: string; message: string }) {
  return (
    <div className="panel-empty" role="status">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
