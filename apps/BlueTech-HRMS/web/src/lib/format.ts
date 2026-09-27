const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
const pesoCompact = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  notation: "compact",
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat("en-PH");

export const formatPeso = (value: number) => peso.format(value);
export const formatPesoCompact = (value: number) => pesoCompact.format(value);
export const formatCount = (value: number) => count.format(value);

// "YYYY-MM-DD" strings are parsed as UTC by Date; read them as local dates instead.
function toDate(value: string) {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
}

export function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-PH", options).format(toDate(value));
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "-";
  const [h, m] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, h, m));
}

export function toNumber(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function computeNet(basic: string, allowance: string, deductions: string) {
  return toNumber(basic) + toNumber(allowance) - toNumber(deductions);
}

export function todayISO() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
