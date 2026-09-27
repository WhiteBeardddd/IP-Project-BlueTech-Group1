import type { AttendanceStatus, EmploymentStatus } from "./types";

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["Present", "Late", "Absent", "On Leave"];
export const EMPLOYMENT_STATUSES: EmploymentStatus[] = ["Active", "On Leave", "Resigned"];

export type Tone = "green" | "amber" | "slate" | "clay";

const TONES: Record<AttendanceStatus | EmploymentStatus, Tone> = {
  Present: "green",
  Active: "green",
  Late: "amber",
  "On Leave": "slate",
  Absent: "clay",
  Resigned: "clay",
};

export const toneFor = (status: AttendanceStatus | EmploymentStatus) => TONES[status];

// Validated categorical order (dataviz validator, light surface: adjacent CVD ΔE ≥ 12, all ≥ 3:1).
// Keep this order: it is what makes neighbouring lines distinguishable.
export const SERIES = {
  present: "#1f7a57",
  late: "#c4892a",
  onLeave: "#3b72b8",
  absent: "#c2553a",
} as const;

export const SINGLE_SERIES = SERIES.present;
