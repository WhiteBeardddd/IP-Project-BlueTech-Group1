import type { Metadata } from "next";
import SalaryView from "@/components/salary/salary-view";

export const metadata: Metadata = { title: "Salary" };

export default function SalaryPage() {
  return <SalaryView />;
}
