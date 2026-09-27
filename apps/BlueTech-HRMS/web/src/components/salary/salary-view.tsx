"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, CircleAlert, Pencil, Plus, SearchX, Trash2, Wallet } from "lucide-react";
import SalaryModal from "./salary-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import FilterTabs, { ALL } from "@/components/ui/filter-tabs";
import PageHeader from "@/components/ui/page-header";
import Pagination, { paginate } from "@/components/ui/pagination";
import { SearchBox } from "@/components/ui/fields";
import { TableCard, type EmptyStateProps } from "@/components/ui/table-states";
import { api } from "@/lib/api";
import { formatDate, formatPeso } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import type { Employee, SalaryRecord } from "@/lib/types";

type SortKey = "full_name" | "basic_salary" | "allowance" | "deductions" | "net_salary" | "updated_at";
type Sort = { key: SortKey; dir: "asc" | "desc" } | null;

const COLUMNS: { label: string; sort?: SortKey; num?: boolean }[] = [
  { label: "Employee", sort: "full_name" },
  { label: "Department" },
  { label: "Position" },
  { label: "Basic Salary", sort: "basic_salary", num: true },
  { label: "Allowance", sort: "allowance", num: true },
  { label: "Deductions", sort: "deductions", num: true },
  { label: "Net Salary", sort: "net_salary", num: true },
  { label: "Last Updated", sort: "updated_at" },
  { label: "Actions" },
];

function sortValue(record: SalaryRecord, key: SortKey) {
  if (key === "full_name") return record.employee?.full_name ?? "";
  if (key === "updated_at") return new Date(record.updated_at).getTime();
  return record[key];
}

export default function SalaryView() {
  const salaries = useApi<SalaryRecord[]>("/salary");
  const employees = useApi<Employee[]>("/employees");
  const records = salaries.data ?? [];
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState(ALL);
  const [role, setRole] = useState(ALL);
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<SalaryRecord | null | "new">(null);
  const [deleting, setDeleting] = useState<SalaryRecord | null>(null);

  const filterBy = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const departments = [...new Set(records.map((s) => s.employee?.department).filter((d): d is string => Boolean(d)))].sort();
  const roles = [...new Set(records.map((s) => s.employee?.position).filter((p): p is string => Boolean(p)))].sort();
  const assigned = new Set(records.map((s) => s.employee_id));
  const unassigned = (employees.data ?? []).filter((e) => !assigned.has(e.id));

  const query = search.trim().toLowerCase();
  const filtered = records.filter(
    (s) =>
      [s.employee?.full_name, s.employee?.employee_id, s.employee?.department, s.employee?.position].join(" ").toLowerCase().includes(query) &&
      (dept === ALL || s.employee?.department === dept) &&
      (role === ALL || s.employee?.position === role),
  );
  if (sort) {
    filtered.sort((a, b) => {
      const x = sortValue(a, sort.key);
      const y = sortValue(b, sort.key);
      const order = typeof x === "string" ? x.localeCompare(String(y)) : x - Number(y);
      return sort.dir === "asc" ? order : -order;
    });
  }
  const view = paginate(filtered, page);
  const hasFilters = Boolean(query) || dept !== ALL || role !== ALL;

  const clearFilters = () => {
    setSearch("");
    setDept(ALL);
    setRole(ALL);
    setPage(1);
  };

  let empty: EmptyStateProps | null = null;
  if (salaries.error) empty = { icon: CircleAlert, title: "Couldn't load salary records", message: salaries.error };
  else if (records.length === 0)
    empty = {
      icon: Wallet,
      title: "No salary records yet",
      message: "Set a basic salary, allowance, and deductions for each employee to prepare payroll.",
      action: <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}><Plus aria-hidden="true" /> Set Salary</button>,
    };
  else if (view.rows.length === 0)
    empty = {
      icon: SearchX,
      title: "No matching salary records",
      message: "Try a different search or clear the filters.",
      action: hasFilters && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>,
    };

  return (
    <>
      <PageHeader title="Salary Management" description="Set and manage employee salary details.">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" /> Set Salary
        </button>
      </PageHeader>

      <div className="toolbar">
        <SearchBox label="Search salaries" placeholder="Search by name, ID, department…" value={search} onChange={(e) => filterBy(setSearch)(e.target.value)} />
        <label className="sr-only" htmlFor="role-filter">Filter by role</label>
        <select id="role-filter" className="control" value={role} onChange={(e) => filterBy(setRole)(e.target.value)}>
          <option value={ALL}>All Roles</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="filters">
        <FilterTabs label="Department" options={departments} active={dept} onChange={filterBy(setDept)} />
      </div>

      <TableCard
        columns={COLUMNS.length}
        loading={salaries.loading}
        empty={empty}
        head={
          <tr>
            {COLUMNS.map(({ label, sort: key, num }) => {
              const active = key && sort?.key === key;
              const Icon = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={label}
                  className={num ? "num" : label === "Actions" ? "actions" : undefined}
                  aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  {key ? (
                    <button type="button" className={`sort-button${active ? " active" : ""}`} onClick={() => toggleSort(key)}>
                      {label} <Icon aria-hidden="true" />
                    </button>
                  ) : label}
                </th>
              );
            })}
          </tr>
        }
      >
        <tbody>
          {view.rows.map((s) => (
            <tr key={s.id}>
              <td><span className="cell-strong">{s.employee?.full_name ?? "Unknown employee"}</span><span className="cell-sub" translate="no">{s.employee?.employee_id}</span></td>
              <td>{s.employee?.department || "-"}</td>
              <td>{s.employee?.position || "-"}</td>
              <td className="num">{formatPeso(s.basic_salary)}</td>
              <td className="num">{formatPeso(s.allowance)}</td>
              <td className="num cell-negative">{formatPeso(s.deductions)}</td>
              <td className="num cell-positive">{formatPeso(s.net_salary)}</td>
              <td>{formatDate(s.updated_at)}</td>
              <td className="actions">
                <div className="row-actions">
                  <button type="button" className="icon-btn" onClick={() => setEditing(s)} aria-label={`Edit salary for ${s.employee?.full_name ?? "employee"}`}><Pencil aria-hidden="true" /></button>
                  <button type="button" className="icon-btn danger" onClick={() => setDeleting(s)} aria-label={`Remove salary for ${s.employee?.full_name ?? "employee"}`}><Trash2 aria-hidden="true" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      {view.caption && <p className="results-caption">{view.caption} salary records</p>}
      <Pagination page={view.page} totalPages={view.totalPages} onChange={setPage} />

      {editing && (
        <SalaryModal
          editTarget={editing === "new" ? null : editing}
          employees={unassigned}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            salaries.reload();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Remove Salary Record?"
          message={<>This removes the salary record for <strong>{deleting.employee?.full_name ?? "this employee"}</strong> and can&apos;t be undone.</>}
          confirmLabel="Remove Record"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/salary/${deleting.id}`);
            setDeleting(null);
            salaries.reload();
          }}
        />
      )}
    </>
  );
}
