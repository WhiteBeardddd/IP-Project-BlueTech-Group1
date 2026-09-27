type FilterTabsProps = {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
};

export const ALL = "All";

export default function FilterTabs({ label, options, active, onChange }: FilterTabsProps) {
  return (
    <div className="filter-row" role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
      <span className="filter-label">{label}</span>
      {[ALL, ...options].map((option) => (
        <button
          key={option}
          type="button"
          className={`filter-chip${active === option ? " selected" : ""}`}
          aria-pressed={active === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
      {options.length === 0 && <span className="filter-none">Options appear once records exist.</span>}
    </div>
  );
}
