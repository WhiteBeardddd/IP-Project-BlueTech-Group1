"use client";

import { useState } from "react";
import { CircleAlert, Pencil, Plus, SearchX, Trash2, Users } from "lucide-react";
import EmployeeModal from "./employee-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import FilterTabs, { ALL } from "@/components/ui/filter-tabs";
import PageHeader from "@/components/ui/page-header";
import Pagination, { paginate } from "@/components/ui/pagination";
import { SearchBox, StatusBadge } from "@/components/ui/fields";
import { TableCard, type EmptyStateProps } from "@/components/ui/table-states";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { EMPLOYMENT_STATUSES } from "@/lib/status";
import { useApi } from "@/lib/use-api";
import type { Employee } from "@/lib/types";

const COLUMNS = ["Emp ID", "Full Name", "Email", "Contact", "Position", "Department", "Date Hired", "Status", "Actions"];

export default function EmployeesView() {
  const { data, loading, error, reload } = useApi<Employee[]>("/employees");
  const employees = data ?? [];
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Employee | null | "new">(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);

  const filterBy = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))].sort();
  const query = search.trim().toLowerCase();
  const filtered = employees.filter(
    (e) =>
      [e.full_name, e.employee_id, e.email, e.department, e.position].join(" ").toLowerCase().includes(query) &&
      (dept === ALL || e.department === dept) &&
      (status === ALL || e.employment_status === status),
  );
  const view = paginate(filtered, page);
  const hasFilters = Boolean(query) || dept !== ALL || status !== ALL;

  const clearFilters = () => {
    setSearch("");
    setDept(ALL);
    setStatus(ALL);
    setPage(1);
  };

  let empty: EmptyStateProps | null = null;
  if (error) empty = { icon: CircleAlert, title: "Couldn't load employees", message: error };
  else if (employees.length === 0)
    empty = {
      icon: Users,
      title: "No employees yet",
      message: "Add your first employee to start tracking attendance, salary, and payroll.",
      action: <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}><Plus aria-hidden="true" /> Add Employee</button>,
    };
  else if (view.rows.length === 0)
    empty = {
      icon: SearchX,
      title: "No matching employees",
      message: "Try a different search or clear the filters.",
      action: hasFilters && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>,
    };

  return (
    <>
      <PageHeader title="Employees" description="Manage all employee records.">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" /> Add Employee
        </button>
      </PageHeader>

      <div className="toolbar">
        <SearchBox label="Search employees" placeholder="Search by name, ID, email, department…" value={search} onChange={(e) => filterBy(setSearch)(e.target.value)} />
      </div>
      <div className="filters">
        <FilterTabs label="Department" options={departments} active={dept} onChange={filterBy(setDept)} />
        <FilterTabs label="Status" options={EMPLOYMENT_STATUSES} active={status} onChange={filterBy(setStatus)} />
      </div>

      <TableCard
        columns={COLUMNS.length}
        loading={loading}
        head={<tr>{COLUMNS.map((c) => <th key={c} className={c === "Actions" ? "actions" : undefined}>{c}</th>)}</tr>}
        empty={empty}
      >
        <tbody>
          {view.rows.map((emp) => (
            <tr key={emp.id}>
              <td className="cell-mono" translate="no">{emp.employee_id}</td>
              <td className="cell-strong">{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.contact_number || "-"}</td>
              <td>{emp.position || "-"}</td>
              <td>{emp.department || "-"}</td>
              <td>{formatDate(emp.date_hired)}</td>
              <td><StatusBadge status={emp.employment_status} /></td>
              <td className="actions">
                <div className="row-actions">
                  <button type="button" className="icon-btn" onClick={() => setEditing(emp)} aria-label={`Edit ${emp.full_name}`}><Pencil aria-hidden="true" /></button>
                  <button type="button" className="icon-btn danger" onClick={() => setDeleting(emp)} aria-label={`Delete ${emp.full_name}`}><Trash2 aria-hidden="true" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      {view.caption && <p className="results-caption">{view.caption} employees</p>}
      <Pagination page={view.page} totalPages={view.totalPages} onChange={setPage} />

      {editing && (
        <EmployeeModal
          editTarget={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete Employee?"
          message={<>This permanently removes <strong>{deleting.full_name}</strong> and can&apos;t be undone.</>}
          confirmLabel="Delete Employee"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/employees/${deleting.id}`);
            setDeleting(null);
            reload();
          }}
        />
      )}
    </>
  );
}
