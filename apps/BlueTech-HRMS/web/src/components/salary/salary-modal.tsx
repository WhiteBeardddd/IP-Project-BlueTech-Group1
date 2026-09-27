"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { MoneyField, NetPreview, ReadonlyField, SelectField } from "@/components/ui/fields";
import { api, errorMessage } from "@/lib/api";
import { computeNet } from "@/lib/format";
import type { Employee, SalaryForm, SalaryRecord } from "@/lib/types";

type Props = {
  editTarget: SalaryRecord | null;
  employees: Employee[]; // employees without a salary record yet
  onClose: () => void;
  onSaved: () => void;
};

export default function SalaryModal({ editTarget, employees, onClose, onSaved }: Props) {
  const [form, setForm] = useState<SalaryForm>(() => ({
    employee_id: editTarget?.employee_id ?? "",
    basic_salary: editTarget ? String(editTarget.basic_salary) : "",
    allowance: editTarget ? String(editTarget.allowance) : "",
    deductions: editTarget ? String(editTarget.deductions) : "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof SalaryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editTarget) await api.put(`/salary/${editTarget.id}`, form);
      else await api.post("/salary", form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editTarget ? "Edit Salary" : "Set Employee Salary"}
      description="Net Salary = Basic Salary + Allowance - Deductions."
      onClose={onClose}
    >
      <form onSubmit={save}>
        <div className="modal-body">
          {editTarget ? (
            <ReadonlyField label="Employee">
              {editTarget.employee?.full_name ?? "Unknown employee"}
              <span className="cell-mono">{editTarget.employee?.employee_id}</span>
            </ReadonlyField>
          ) : (
            <SelectField
              label="Employee *"
              name="employee_id"
              value={form.employee_id}
              onChange={set("employee_id")}
              required
              hint={employees.length === 0 ? "Every employee already has a salary, or no employees exist yet." : undefined}
            >
              <option value="">Select an employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name} ({e.employee_id})</option>)}
            </SelectField>
          )}
          <MoneyField label="Basic Salary *" name="basic_salary" value={form.basic_salary} onChange={set("basic_salary")} required />
          <MoneyField label="Allowance" name="allowance" value={form.allowance} onChange={set("allowance")} />
          <MoneyField label="Deductions" name="deductions" value={form.deductions} onChange={set("deductions")} />
          <NetPreview value={computeNet(form.basic_salary, form.allowance, form.deductions)} />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editTarget ? "Save Changes" : "Set Salary"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
