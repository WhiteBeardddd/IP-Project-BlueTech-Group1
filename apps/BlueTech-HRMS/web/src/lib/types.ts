// Shapes the HRMS API is expected to return. The frontend is built against
// these contracts first; the NestJS api implements them later.

export type EmploymentStatus = "Active" | "On Leave" | "Resigned";
export type AttendanceStatus = "Present" | "Late" | "Absent" | "On Leave";

export type Employee = {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  contact_number: string;
  position: string;
  department: string;
  date_hired: string;
  employment_status: EmploymentStatus;
  created_at: string;
};

export type EmployeeForm = Omit<Employee, "id" | "created_at">;

export type EmployeeSummary = Pick<Employee, "employee_id" | "full_name" | "department" | "position">;

export type SalaryRecord = {
  id: string;
  employee_id: string;
  basic_salary: number;
  allowance: number;
  deductions: number;
  net_salary: number;
  updated_at: string;
  employee: EmployeeSummary | null;
};

export type SalaryForm = {
  employee_id: string;
  basic_salary: string;
  allowance: string;
  deductions: string;
};

export type AttendanceRecord = {
  id: string;
  employee_id: string;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: AttendanceStatus;
  created_at: string;
  employee: EmployeeSummary | null;
};

export type AttendanceForm = {
  employee_id: string;
  date: string;
  time_in: string;
  time_out: string;
  status: AttendanceStatus;
};

export type PayrollRecord = {
  id: string;
  employee_id: string;
  basic_salary: number;
  allowance: number;
  deductions: number;
  net_salary: number;
  payroll_date: string;
  created_at: string;
  employee: EmployeeSummary | null;
};

export type PayrollForm = {
  employee_id: string;
  basic_salary: string;
  allowance: string;
  deductions: string;
  payroll_date: string;
};

export type DashboardStats = {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  totalMonthlyPayroll: number;
};

export type ActivityItem = {
  id: string;
  type: "attendance" | "payroll";
  name: string;
  status?: AttendanceStatus;
  amount?: number;
  date: string;
};

export type TodaySnapshot = {
  date: string;
  counts: Partial<Record<AttendanceStatus, number>>;
};

export type AttendanceTrendPoint = {
  date: string;
  present: number;
  late: number;
  onLeave: number;
  absent: number;
};

export type PayrollTrendPoint = {
  month: string;
  total: number;
};

export type DepartmentPayroll = {
  date: string;
  departments: { department: string; total: number }[];
};

export type DepartmentHeadcount = {
  department: string;
  count: number;
};

export type Admin = {
  id: string;
  email: string;
};
