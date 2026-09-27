import type { LucideIcon } from "lucide-react";

export function TableSkeleton({ columns, rows = 6 }: { columns: number; rows?: number }) {
  return (
    <tbody aria-busy="true">
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }, (_, c) => (
            <td key={c}>
              <span className="skeleton" style={{ width: `${c === 0 ? 70 : 45 + ((r + c) % 3) * 15}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-icon"><Icon aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}

type TableCardProps = {
  columns: number;
  head: React.ReactNode;
  loading: boolean;
  // Shown instead of the table (errors, no records, no matches), so it never scrolls sideways with it.
  empty: EmptyStateProps | null;
  children: React.ReactNode;
};

export function TableCard({ columns, head, loading, empty, children }: TableCardProps) {
  return (
    <div className="card table-card">
      {!loading && empty ? (
        <EmptyState {...empty} />
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>{head}</thead>
            {loading ? <TableSkeleton columns={columns} /> : children}
          </table>
        </div>
      )}
    </div>
  );
}
