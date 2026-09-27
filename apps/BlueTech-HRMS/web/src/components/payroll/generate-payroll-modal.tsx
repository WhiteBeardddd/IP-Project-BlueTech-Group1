"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { MoneyField, NetPreview, SelectField, TextField } from "@/components/ui/fields";
import { api, errorMessage } from "@/lib/api";
import { computeNet, todayISO } from "@/lib/format";
import type { Employee, PayrollForm, SalaryRecord } from "@/lib/types";

type Props = {
  employees: Employee[];
  salaries: SalaryRecord[];
  onClose: () => void;
  onSaved: () => void;
};

export default function GeneratePayrollModal({ employees, salaries, onClose, onSaved }: Props) {
  const [form, setForm] = useState<PayrollForm>(() => ({
    employee_id: "",
    basic_salary: "",
    allowance: "",
    deductions: "",
    payroll_date: todayISO(),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof PayrollForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // Picking an employee pre-fills their current salary figures.
  const selectEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const salary = salaries.find((s) => s.employee_id === id);
    setForm((f) => ({
      ...f,
      employee_id: id,
      basic_salary: salary ? String(salary.basic_salary) : "",
      allowance: salary ? String(salary.allowance) : "",
      deductions: salary ? String(salary.deductions) : "",
    }));
  };

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/payroll", form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal title="Generate Payroll" description="Select an employee and their salary details fill in automatically." onClose={onClose}>
      <form onSubmit={save}>
        <div className="modal-body">
          <SelectField
            label="Employee *"
            name="employee_id"
            value={form.employee_id}
            onChange={selectEmployee}
            required
            hint={employees.length === 0 ? "Add employees and set their salaries first." : undefined}
          >
            <option value="">Select an employee</option>
            {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name} ({e.employee_id})</option>)}
          </SelectField>
          <div className="form-grid">
            <MoneyField label="Basic Salary" name="basic_salary" value={form.basic_salary} onChange={set("basic_salary")} />
            <MoneyField label="Allowance" name="allowance" value={form.allowance} onChange={set("allowance")} />
            <MoneyField label="Deductions" name="deductions" value={form.deductions} onChange={set("deductions")} />
            <TextField label="Payroll Date *" name="payroll_date" type="date" value={form.payroll_date} onChange={set("payroll_date")} required />
          </div>
          <NetPreview value={computeNet(form.basic_salary, form.allowance, form.deductions)} />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Generating…" : "Generate Payroll"}</button>
        </div>
      </form>
    </Modal>
  );
}
