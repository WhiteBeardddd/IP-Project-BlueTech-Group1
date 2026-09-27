"use client";

import { useState } from "react";
import { CircleAlert, Plus, Printer, ReceiptText, SearchX, Trash2 } from "lucide-react";
import GeneratePayrollModal from "./generate-payroll-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import FilterTabs, { ALL } from "@/components/ui/filter-tabs";
import PageHeader from "@/components/ui/page-header";
import Pagination, { paginate } from "@/components/ui/pagination";
import { SearchBox } from "@/components/ui/fields";
import { TableCard, type EmptyStateProps } from "@/components/ui/table-states";
import { api } from "@/lib/api";
import { useClientValue } from "@/lib/client-store";
import { formatDate, formatPeso, todayISO } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Employee, PayrollRecord, SalaryRecord } from "@/lib/types";

const COLUMNS: { label: string; num?: boolean }[] = [
  { label: "Employee" },
  { label: "Department" },
  { label: "Basic Salary", num: true },
  { label: "Allowance", num: true },
  { label: "Deductions", num: true },
  { label: "Net Salary", num: true },
  { label: "Payroll Date" },
  { label: "Actions" },
];

export default function PayrollView() {
  const payroll = useApi<PayrollRecord[]>("/payroll");
  const employees = useApi<Employee[]>("/employees");
  const salaries = useApi<SalaryRecord[]>("/salary");
  const records = payroll.data ?? [];
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [dept, setDept] = useState(ALL);
  const [page, setPage] = useState(1);
  const [generating, setGenerating] = useState(false);
  const printedOn = useClientValue(() => formatDate(todayISO(), { dateStyle: "long" }));
  const [deleting, setDeleting] = useState<PayrollRecord | null>(null);

  const filterBy = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const departments = [...new Set(records.map((p) => p.employee?.department).filter((d): d is string => Boolean(d)))].sort();
  const query = search.trim().toLowerCase();
  const filtered = records.filter(
    (p) =>
      [p.employee?.full_name, p.employee?.employee_id, p.employee?.department].join(" ").toLowerCase().includes(query) &&
      (!date || p.payroll_date === date) &&
      (dept === ALL || p.employee?.department === dept),
  );
  const view = paginate(filtered, page);
  const onPage = new Set(view.rows.map((p) => p.id));
  const totalNet = filtered.reduce((sum, p) => sum + Number(p.net_salary || 0), 0);
  const hasFilters = Boolean(query || date) || dept !== ALL;

  const clearFilters = () => {
    setSearch("");
    setDate("");
    setDept(ALL);
    setPage(1);
  };

  let empty: EmptyStateProps | null = null;
  if (payroll.error) empty = { icon: CircleAlert, title: "Couldn't load payroll", message: payroll.error };
  else if (records.length === 0)
    empty = {
      icon: ReceiptText,
      title: "No payroll generated yet",
      message: "Generate payroll for an employee to build the summary for this period.",
      action: <button type="button" className="btn btn-primary" onClick={() => setGenerating(true)}><Plus aria-hidden="true" /> Generate Payroll</button>,
    };
  else if (filtered.length === 0)
    empty = {
      icon: SearchX,
      title: "No matching payroll records",
      message: "Try a different search or clear the filters.",
      action: <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>,
    };

  return (
    <>
      <PageHeader title="Payroll Summary" description="View and generate employee payroll computations.">
        <button type="button" className="btn btn-secondary" onClick={() => window.print()} disabled={filtered.length === 0}>
          <Printer aria-hidden="true" /> Print Summary
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setGenerating(true)}>
          <Plus aria-hidden="true" /> Generate Payroll
        </button>
      </PageHeader>

      <div className="print-only">
        <h1>BlueTech HRMS Payroll Summary</h1>
        <p>Generated on {printedOn}</p>
      </div>

      <div className="toolbar no-print">
        <SearchBox label="Search payroll" placeholder="Search by name, ID, or department…" value={search} onChange={(e) => filterBy(setSearch)(e.target.value)} />
        <label className="sr-only" htmlFor="payroll-date-filter">Filter by payroll date</label>
        <input id="payroll-date-filter" type="date" className="control" value={date} onChange={(e) => filterBy(setDate)(e.target.value)} />
        {hasFilters && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>}
      </div>
      <div className="filters no-print">
        <FilterTabs label="Department" options={departments} active={dept} onChange={filterBy(setDept)} />
      </div>

      <TableCard
        columns={COLUMNS.length}
        loading={payroll.loading}
        empty={empty}
        head={
          <tr>
            {COLUMNS.map(({ label, num }) => (
              <th key={label} className={num ? "num" : label === "Actions" ? "actions no-print" : undefined}>{label}</th>
            ))}
          </tr>
        }
      >
        {/* Every filtered row renders; rows off the current page only show when printing. */}
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className={onPage.has(p.id) ? undefined : "print-row"}>
              <td><span className="cell-strong">{p.employee?.full_name ?? "Unknown employee"}</span><span className="cell-sub" translate="no">{p.employee?.employee_id}</span></td>
              <td>{p.employee?.department || "-"}</td>
              <td className="num">{formatPeso(p.basic_salary)}</td>
              <td className="num">{formatPeso(p.allowance)}</td>
              <td className="num cell-negative">-{formatPeso(p.deductions)}</td>
              <td className="num cell-positive">{formatPeso(p.net_salary)}</td>
              <td>{formatDate(p.payroll_date)}</td>
              <td className="actions no-print">
                <button type="button" className="icon-btn danger" onClick={() => setDeleting(p)} aria-label={`Delete payroll for ${p.employee?.full_name ?? "employee"}`}><Trash2 aria-hidden="true" /></button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="num">Total Net Payroll ({filtered.length} {filtered.length === 1 ? "record" : "records"})</td>
            <td className="num cell-positive">{formatPeso(totalNet)}</td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </TableCard>

      {view.caption && <p className="results-caption no-print">{view.caption} payroll records</p>}
      <Pagination page={view.page} totalPages={view.totalPages} onChange={setPage} />

      {generating && (
        <GeneratePayrollModal
          employees={employees.data ?? []}
          salaries={salaries.data ?? []}
          onClose={() => setGenerating(false)}
          onSaved={() => {
            setGenerating(false);
            payroll.reload();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete Payroll Record?"
          message={<>This permanently deletes the payroll record for <strong>{deleting.employee?.full_name ?? "this employee"}</strong> dated <strong>{formatDate(deleting.payroll_date)}</strong>.</>}
          confirmLabel="Delete Record"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/payroll/${deleting.id}`);
            setDeleting(null);
            payroll.reload();
          }}
        />
      )}
    </>
  );
}
