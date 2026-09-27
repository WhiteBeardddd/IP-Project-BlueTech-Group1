import type { Metadata } from "next";
import JobBoard from "../components/job-board";

export const metadata: Metadata = {
  title: "Open Positions | BlueTech Careers",
  description: "Search open BlueTech jobs by role, location, and department.",
};

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ department?: string }> }) {
  const { department } = await searchParams;
  const initialDepartment = ["Logistics", "Finance", "Operations", "HR"].includes(department ?? "")
    ? department as "Logistics" | "Finance" | "Operations" | "HR"
    : "All";

  return <JobBoard initialDepartment={initialDepartment} />;
}