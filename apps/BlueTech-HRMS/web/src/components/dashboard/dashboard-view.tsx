"use client";

import { CircleAlert, Plane, UserCheck, Users, Wallet, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import AttendanceTrendChart from "./attendance-trend-chart";
import DepartmentHeadcountChart from "./department-headcount-chart";
import PayrollByDepartmentChart from "./payroll-by-department-chart";
import PayrollTrendChart from "./payroll-trend-chart";
import RecentActivity from "./recent-activity";
import TodaySnapshot from "./today-snapshot";
import { ADMIN_KEY, useClientValue, useStored } from "@/lib/client-store";
import { useApi } from "@/lib/use-api";
import { formatCount, formatPeso } from "@/lib/format";
import type { Admin, DashboardStats } from "@/lib/types";

type Tile = { label: string; icon: LucideIcon; tone: string; value: (s: DashboardStats) => string; featured?: boolean };

const TILES: Tile[] = [
  { label: "Total Employees", icon: Users, tone: "", value: (s) => formatCount(s.totalEmployees), featured: true },
  { label: "Active Employees", icon: UserCheck, tone: "tone-green", value: (s) => formatCount(s.activeEmployees) },
  { label: "Employees on Leave", icon: Plane, tone: "tone-slate", value: (s) => formatCount(s.onLeave) },
  { label: "Total Monthly Payroll", icon: Wallet, tone: "tone-amber", value: (s) => formatPeso(s.totalMonthlyPayroll) },
];

function adminName(raw: string | null) {
  if (!raw) return "";
  try {
    return (JSON.parse(raw) as Admin).email.split("@")[0];
  } catch {
    return "";
  }
}

const todayLabel = () => new Intl.DateTimeFormat("en-PH", { dateStyle: "full" }).format(new Date());

export default function DashboardView() {
  const stats = useApi<DashboardStats>("/dashboard/stats");
  const name = adminName(useStored(ADMIN_KEY));
  const today = useClientValue(todayLabel);

  return (
    <>
      <PageHeader title="Dashboard" description={name ? <>Welcome back, <strong>{name}</strong>.</> : "Welcome back."}>
        {today && <span className="date-chip">{today}</span>}
      </PageHeader>

      {(stats.error || stats.missing) && (
        <p className="notice" role="status">
          <CircleAlert aria-hidden="true" />
          <span>Dashboard figures appear once the HRMS API provides them. {stats.error}</span>
        </p>
      )}

      <div className="stat-grid">
        {TILES.map(({ label, icon: Icon, tone, value, featured }) => (
          <section key={label} className={`card stat-card${featured ? " featured" : ""}`}>
            <div className="stat-top">
              <h2 className="stat-label">{label}</h2>
              <span className={`stat-icon ${tone}`}><Icon aria-hidden="true" /></span>
            </div>
            {stats.loading ? (
              <span className="skeleton" style={{ width: "55%", height: 26 }} aria-busy="true" />
            ) : (
              <p className="stat-value">{stats.data ? value(stats.data) : <span className="stat-empty">No data yet</span>}</p>
            )}
          </section>
        ))}
      </div>

      <div className="dash-row">
        <RecentActivity />
        <TodaySnapshot />
      </div>

      <h2 className="section-title">Analytics</h2>
      <div className="chart-grid">
        <AttendanceTrendChart />
        <PayrollTrendChart />
        <PayrollByDepartmentChart />
        <DepartmentHeadcountChart />
      </div>
    </>
  );
}
