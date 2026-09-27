import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function pageList(page: number, totalPages: number) {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }
  return pages;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination no-print" aria-label="Pagination">
      <button type="button" className="page-arrow" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft aria-hidden="true" />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="page-gap" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`page-number${p === page ? " current" : ""}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="page-arrow" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}

export const PAGE_SIZE = 10;

export function paginate<T>(rows: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  return {
    page: current,
    totalPages,
    rows: rows.slice(start, start + PAGE_SIZE),
    caption: rows.length ? `Showing ${start + 1}-${Math.min(start + PAGE_SIZE, rows.length)} of ${rows.length}` : "",
  };
}
