"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { ReadonlyField, SelectField, TextField } from "@/components/ui/fields";
import { api, errorMessage } from "@/lib/api";
import { todayISO } from "@/lib/format";
import { ATTENDANCE_STATUSES } from "@/lib/status";
import type { AttendanceForm, AttendanceRecord, AttendanceStatus, Employee } from "@/lib/types";

const LATE_AFTER_MINUTES = 9 * 60; // 9:00 AM

type Props = {
  editTarget: AttendanceRecord | null;
  employees: Employee[];
  onClose: () => void;
  onSaved: () => void;
};

export default function AttendanceModal({ editTarget, employees, onClose, onSaved }: Props) {
  const [form, setForm] = useState<AttendanceForm>(() => ({
    employee_id: editTarget?.employee_id ?? "",
    date: editTarget?.date ?? todayISO(),
    time_in: editTarget?.time_in ?? "",
    time_out: editTarget?.time_out ?? "",
    status: editTarget?.status ?? "Present",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof AttendanceForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // Suggest a status from Time In, the admin can still override it.
  const setTimeIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => {
      if (!value) return { ...f, time_in: value };
      const [h, m] = value.split(":").map(Number);
      return { ...f, time_in: value, status: h * 60 + m > LATE_AFTER_MINUTES ? "Late" : "Present" };
    });
  };

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editTarget) await api.put(`/attendance/${editTarget.id}`, form);
      else await api.post("/attendance", form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={editTarget ? "Edit Attendance" : "Record Attendance"} onClose={onClose}>
      <form onSubmit={save}>
        <div className="modal-body">
          {editTarget ? (
            <ReadonlyField label="Employee">{editTarget.employee?.full_name ?? "Unknown employee"}</ReadonlyField>
          ) : (
            <SelectField
              label="Employee *"
              name="employee_id"
              value={form.employee_id}
              onChange={set("employee_id")}
              required
              hint={employees.length === 0 ? "Add employees first to record their attendance." : undefined}
            >
              <option value="">Select an employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name} ({e.employee_id})</option>)}
            </SelectField>
          )}
          <TextField label="Date *" name="date" type="date" value={form.date} onChange={set("date")} required />
          <div className="form-grid">
            <TextField label="Time In" name="time_in" type="time" value={form.time_in} onChange={setTimeIn} />
            <TextField label="Time Out" name="time_out" type="time" value={form.time_out} onChange={set("time_out")} />
          </div>
          <SelectField
            label="Status *"
            name="status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AttendanceStatus }))}
            hint="Status is suggested from Time In. After 9:00 AM counts as Late."
          >
            {ATTENDANCE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </SelectField>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Record Attendance"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
