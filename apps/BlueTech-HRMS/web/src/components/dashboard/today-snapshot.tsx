"use client";

import { CalendarOff, CircleCheck, Clock, Plane } from "lucide-react";
import { PanelEmpty } from "./chart-parts";
import { useApi } from "@/lib/use-api";
import { formatCount, formatDate } from "@/lib/format";
import { toneFor } from "@/lib/status";
import type { AttendanceStatus, TodaySnapshot as Snapshot } from "@/lib/types";

const TILES: { status: AttendanceStatus; icon: typeof CircleCheck }[] = [
  { status: "Present", icon: CircleCheck },
  { status: "Late", icon: Clock },
  { status: "Absent", icon: CalendarOff },
  { status: "On Leave", icon: Plane },
];

export default function TodaySnapshot() {
  const { data, loading } = useApi<Snapshot>("/attendance/today");

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">Today&apos;s Snapshot</h2>
        {data?.date && <span className="card-meta">{formatDate(data.date, { month: "short", day: "numeric" })}</span>}
      </div>
      <div className="card-body">
        {loading ? (
          <div className="snapshot-grid" aria-busy="true">
            {TILES.map(({ status }) => <span key={status} className="skeleton" style={{ height: 66, borderRadius: 9 }} />)}
          </div>
        ) : !data ? (
          <PanelEmpty title="No attendance today" message="Present, Late, Absent, and On Leave counts appear once today's attendance is recorded." />
        ) : (
          <div className="snapshot-grid">
            {TILES.map(({ status, icon: Icon }) => (
              <div key={status} className={`snapshot-tile tone-${toneFor(status)}`}>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{formatCount(data.counts[status] ?? 0)}</strong>
                  <span>{status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
