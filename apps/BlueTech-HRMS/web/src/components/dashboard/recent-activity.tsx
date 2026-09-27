"use client";

import { CalendarCheck, ReceiptText } from "lucide-react";
import { PanelEmpty } from "./chart-parts";
import { StatusBadge } from "@/components/ui/fields";
import { useApi } from "@/lib/use-api";
import { formatDate, formatPeso } from "@/lib/format";
import type { ActivityItem } from "@/lib/types";

export default function RecentActivity() {
  const { data, loading } = useApi<ActivityItem[]>("/activity/recent");
  const items = (data ?? []).slice(0, 6);

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">Recent Activity</h2>
        <span className="card-meta">Attendance and payroll</span>
      </div>
      <div className="card-body">
        {loading ? (
          <div aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="activity-item">
                <span className="activity-icon skeleton" />
                <div className="activity-copy"><span className="skeleton" style={{ width: "50%" }} /></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <PanelEmpty title="No activity yet" message="Attendance logs and generated payroll will show up here as they happen." />
        ) : (
          <ul className="activity-list">
            {items.map((item) => {
              const isPayroll = item.type === "payroll";
              const Icon = isPayroll ? ReceiptText : CalendarCheck;
              return (
                <li key={`${item.type}-${item.id}`} className="activity-item">
                  <span className={`activity-icon ${isPayroll ? "tone-slate" : "tone-green"}`}><Icon aria-hidden="true" /></span>
                  <div className="activity-copy">
                    <strong>{item.name}</strong>
                    <span>{isPayroll ? "Payroll processed" : "Attendance logged"}</span>
                  </div>
                  <div className="activity-side">
                    {isPayroll ? (
                      <span className="activity-amount">{formatPeso(item.amount ?? 0)}</span>
                    ) : (
                      item.status && <StatusBadge status={item.status} />
                    )}
                    <span className="activity-date">{formatDate(item.date, { month: "short", day: "numeric" })}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
