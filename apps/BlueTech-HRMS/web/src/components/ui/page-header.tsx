type PageHeaderProps = {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
};

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="page-header no-print">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
