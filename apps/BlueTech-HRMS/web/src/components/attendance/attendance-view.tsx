"use client";

import { useState } from "react";
import { CalendarCheck, CircleAlert, Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import AttendanceModal from "./attendance-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PageHeader from "@/components/ui/page-header";
import Pagination, { paginate } from "@/components/ui/pagination";
import { SearchBox, StatusBadge } from "@/components/ui/fields";
import { TableCard, type EmptyStateProps } from "@/components/ui/table-states";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import { ATTENDANCE_STATUSES } from "@/lib/status";
import { useApi } from "@/lib/use-api";
import type { AttendanceRecord, Employee } from "@/lib/types";

const COLUMNS = ["Employee", "Department", "Date", "Time In", "Time Out", "Status", "Actions"];

export default function AttendanceView() {
  const attendance = useApi<AttendanceRecord[]>("/attendance");
  const employees = useApi<Employee[]>("/employees");
  const records = attendance.data ?? [];
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AttendanceRecord | null | "new">(null);
  const [deleting, setDeleting] = useState<AttendanceRecord | null>(null);

  const filterBy = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const query = search.trim().toLowerCase();
  const filtered = records.filter(
    (a) =>
      [a.employee?.full_name, a.employee?.employee_id, a.employee?.department].join(" ").toLowerCase().includes(query) &&
      (!date || a.date === date) &&
      (!status || a.status === status),
  );
  const view = paginate(filtered, page);
  const hasFilters = Boolean(query || date || status);

  const clearFilters = () => {
    setSearch("");
    setDate("");
    setStatus("");
    setPage(1);
  };

  let empty: EmptyStateProps | null = null;
  if (attendance.error) empty = { icon: CircleAlert, title: "Couldn't load attendance", message: attendance.error };
  else if (records.length === 0)
    empty = {
      icon: CalendarCheck,
      title: "No attendance recorded yet",
      message: "Record time in, time out, and status for each employee's workday.",
      action: <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}><Plus aria-hidden="true" /> Record Attendance</button>,
    };
  else if (view.rows.length === 0)
    empty = {
      icon: SearchX,
      title: "No matching records",
      message: "Try a different search or clear the filters.",
      action: <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>,
    };

  return (
    <>
      <PageHeader title="Attendance" description="Record and manage employee attendance.">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" /> Record Attendance
        </button>
      </PageHeader>

      <div className="toolbar">
        <SearchBox label="Search attendance" placeholder="Search by name, ID, department…" value={search} onChange={(e) => filterBy(setSearch)(e.target.value)} />
        <label className="sr-only" htmlFor="date-filter">Filter by date</label>
        <input id="date-filter" type="date" className="control" value={date} onChange={(e) => filterBy(setDate)(e.target.value)} />
        <label className="sr-only" htmlFor="status-filter">Filter by status</label>
        <select id="status-filter" className="control" value={status} onChange={(e) => filterBy(setStatus)(e.target.value)}>
          <option value="">All Statuses</option>
          {ATTENDANCE_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        {hasFilters && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>}
      </div>

      <TableCard
        columns={COLUMNS.length}
        loading={attendance.loading}
        empty={empty}
        head={<tr>{COLUMNS.map((c) => <th key={c} className={c === "Actions" ? "actions" : undefined}>{c}</th>)}</tr>}
      >
        <tbody>
          {view.rows.map((a) => (
            <tr key={a.id}>
              <td><span className="cell-strong">{a.employee?.full_name ?? "Unknown employee"}</span><span className="cell-sub" translate="no">{a.employee?.employee_id}</span></td>
              <td>{a.employee?.department || "-"}</td>
              <td>{formatDate(a.date)}</td>
              <td>{formatTime(a.time_in)}</td>
              <td>{formatTime(a.time_out)}</td>
              <td><StatusBadge status={a.status} /></td>
              <td className="actions">
                <div className="row-actions">
                  <button type="button" className="icon-btn" onClick={() => setEditing(a)} aria-label={`Edit attendance for ${a.employee?.full_name ?? "employee"}`}><Pencil aria-hidden="true" /></button>
                  <button type="button" className="icon-btn danger" onClick={() => setDeleting(a)} aria-label={`Delete attendance for ${a.employee?.full_name ?? "employee"}`}><Trash2 aria-hidden="true" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>

      {view.caption && <p className="results-caption">{view.caption} records</p>}
      <Pagination page={view.page} totalPages={view.totalPages} onChange={setPage} />

      {editing && (
        <AttendanceModal
          editTarget={editing === "new" ? null : editing}
          employees={employees.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            attendance.reload();
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete Record?"
          message={<>This deletes the attendance record for <strong>{deleting.employee?.full_name ?? "this employee"}</strong> on <strong>{formatDate(deleting.date)}</strong>.</>}
          confirmLabel="Delete Record"
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/attendance/${deleting.id}`);
            setDeleting(null);
            attendance.reload();
          }}
        />
      )}
    </>
  );
}
