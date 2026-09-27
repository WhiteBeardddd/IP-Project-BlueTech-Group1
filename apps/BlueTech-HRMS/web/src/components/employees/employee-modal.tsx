"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { SelectField, TextField } from "@/components/ui/fields";
import { api, errorMessage } from "@/lib/api";
import { EMPLOYMENT_STATUSES } from "@/lib/status";
import type { Employee, EmployeeForm, EmploymentStatus } from "@/lib/types";

const EMPTY: EmployeeForm = {
  employee_id: "",
  full_name: "",
  email: "",
  contact_number: "",
  position: "",
  department: "",
  date_hired: "",
  employment_status: "Active",
};

type Props = {
  editTarget: Employee | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EmployeeModal({ editTarget, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EmployeeForm>(() =>
    editTarget
      ? (Object.fromEntries(Object.keys(EMPTY).map((key) => [key, editTarget[key as keyof EmployeeForm] ?? ""])) as EmployeeForm)
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof EmployeeForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editTarget) await api.put(`/employees/${editTarget.id}`, form);
      else await api.post("/employees", form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title={editTarget ? "Edit Employee" : "Add New Employee"} description="Fields marked * are required." onClose={onClose}>
      <form onSubmit={save}>
        <div className="modal-body form-grid">
          <TextField label="Employee ID *" name="employee_id" value={form.employee_id} onChange={set("employee_id")} placeholder="e.g. EMP-0147…" autoComplete="off" spellCheck={false} required />
          <TextField label="Full Name *" name="full_name" value={form.full_name} onChange={set("full_name")} placeholder="e.g. Maricel Dizon…" autoComplete="off" required />
          <TextField label="Email *" name="email" type="email" value={form.email} onChange={set("email")} placeholder="e.g. maricel@bluetech.com…" autoComplete="off" spellCheck={false} required />
          <TextField label="Contact Number" name="contact_number" type="tel" inputMode="tel" value={form.contact_number} onChange={set("contact_number")} placeholder="e.g. 0917 482 3391…" autoComplete="off" />
          <TextField label="Position" name="position" value={form.position} onChange={set("position")} placeholder="e.g. QA Analyst…" autoComplete="off" />
          <TextField label="Department" name="department" value={form.department} onChange={set("department")} placeholder="e.g. Engineering…" autoComplete="off" />
          <TextField label="Date Hired" name="date_hired" type="date" value={form.date_hired} onChange={set("date_hired")} />
          <SelectField
            label="Employment Status"
            name="employment_status"
            value={form.employment_status}
            onChange={(e) => setForm((f) => ({ ...f, employment_status: e.target.value as EmploymentStatus }))}
          >
            {EMPLOYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </SelectField>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
