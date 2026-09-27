"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import { formatPeso } from "@/lib/format";
import type { AttendanceStatus, EmploymentStatus } from "@/lib/types";
import { toneFor } from "@/lib/status";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export function TextField({ label, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="control" {...input} />
    </div>
  );
}

export function MoneyField({ label, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="money-input">
        <span aria-hidden="true">₱</span>
        <input id={id} className="control" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" autoComplete="off" {...input} />
      </div>
    </div>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string };

export function SelectField({ label, hint, children, ...select }: SelectFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="control" {...select}>{children}</select>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function ReadonlyField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="readonly-value">{children}</div>
    </div>
  );
}

export function NetPreview({ value }: { value: number }) {
  return (
    <div className="net-preview" aria-live="polite">
      <span>Net Salary</span>
      <strong>{formatPeso(value)}</strong>
    </div>
  );
}

export function SearchBox({ label, ...input }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="search-box">
      <Search aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input type="search" autoComplete="off" spellCheck={false} {...input} />
    </label>
  );
}

export function StatusBadge({ status }: { status: AttendanceStatus | EmploymentStatus }) {
  return <span className={`badge tone-${toneFor(status)}`}>{status}</span>;
}
