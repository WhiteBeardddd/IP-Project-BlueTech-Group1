import type { Metadata } from "next";
import { CalendarCheck, ReceiptText, Users, Wallet } from "lucide-react";
import Brand from "@/components/shell/brand";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = { title: "Sign In" };

const FEATURES = [
  { label: "Employee Records", icon: Users },
  { label: "Attendance Tracking", icon: CalendarCheck },
  { label: "Salary Management", icon: Wallet },
  { label: "Payroll Summary", icon: ReceiptText },
];

export default function LoginPage() {
  return (
    <div className="login-page">
      <section className="login-aside" aria-label="About BlueTech HRMS">
        <div className="hero-lines" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
        <Brand href="/login" />
        <div>
          <h1>Smarter HR, <em>simplified.</em></h1>
          <p>One place to manage employees, attendance, salaries, and payroll.</p>
        </div>
        <ul className="login-features">
          {FEATURES.map(({ label, icon: Icon }) => (
            <li key={label}><Icon aria-hidden="true" strokeWidth={1.75} />{label}</li>
          ))}
        </ul>
      </section>
      <main className="login-panel">
        <LoginForm />
      </main>
    </div>
  );
}
