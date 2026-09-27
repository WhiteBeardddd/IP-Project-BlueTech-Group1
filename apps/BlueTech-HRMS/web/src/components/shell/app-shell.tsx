"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck, ChevronLeft, LayoutDashboard, LogOut, ReceiptText, Users, Wallet } from "lucide-react";
import Brand from "./brand";
import { ADMIN_KEY, SIDEBAR_KEY, useStored, writeStored } from "@/lib/client-store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/salary", label: "Salary", icon: Wallet },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/payroll", label: "Payroll", icon: ReceiptText },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useStored(SIDEBAR_KEY) === "true";

  const logout = () => {
    writeStored(ADMIN_KEY, null);
    router.push("/login");
  };

  return (
    <div className="app-shell" data-collapsed={collapsed}>
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="sidebar">
        <div className="sidebar-head">
          <Brand href="/dashboard" />
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => writeStored(SIDEBAR_KEY, String(!collapsed))}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`side-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
              >
                <Icon aria-hidden="true" strokeWidth={1.75} />
                <span className="side-label">{label}</span>
              </Link>
            );
          })}
        </nav>
        <button type="button" className="side-link side-logout" onClick={logout} title={collapsed ? "Log Out" : undefined}>
          <LogOut aria-hidden="true" strokeWidth={1.75} />
          <span className="side-label">Log Out</span>
        </button>
      </aside>
      <main id="main" className="app-main" tabIndex={-1}>{children}</main>
    </div>
  );
}
