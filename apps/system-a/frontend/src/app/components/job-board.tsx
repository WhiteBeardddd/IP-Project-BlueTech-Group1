"use client";

import { useEffect, useMemo, useState } from "react";

type Department = "Logistics" | "Finance" | "Operations" | "HR";
type Job = {
  title: string;
  department: Department;
  type: "Full-time" | "Part-time";
  location: string;
  posted: string;
  description: string;
};

const jobs: Job[] = [
  { title: "Warehouse Associate", department: "Logistics", type: "Full-time", location: "Austin, TX", posted: "2 days ago", description: "Keep orders moving through our distribution center. You'll receive, organize, and prepare products for shipment while keeping safety and accuracy at the center of every shift." },
  { title: "Senior Financial Analyst", department: "Finance", type: "Full-time", location: "Austin, TX", posted: "1 day ago", description: "Partner with business leaders to turn financial data into clear plans. This role owns forecasting, performance reporting, and analysis across multiple teams." },
  { title: "Operations Coordinator", department: "Operations", type: "Full-time", location: "Round Rock, TX", posted: "3 days ago", description: "Coordinate the day-to-day details that help our teams do their best work, from scheduling and documentation to resolving operational requests." },
  { title: "People & Culture Specialist", department: "HR", type: "Full-time", location: "Austin, TX", posted: "4 days ago", description: "Help create a thoughtful employee experience across the full people lifecycle, supporting onboarding, employee questions, and people programs." },
  { title: "Logistics Team Lead", department: "Logistics", type: "Full-time", location: "Georgetown, TX", posted: "5 days ago", description: "Lead a hands-on warehouse team, coach safe working practices, and help the operation hit its daily service and quality goals." },
  { title: "Accounts Payable Clerk", department: "Finance", type: "Part-time", location: "Austin, TX", posted: "1 week ago", description: "Support accurate, timely invoice processing and vendor communication as part of a collaborative finance team." },
  { title: "Workplace Operations Associate", department: "Operations", type: "Full-time", location: "Austin, TX", posted: "1 week ago", description: "Make our workplace run smoothly by coordinating facilities requests, supplies, and office services with care and attention to detail." },
  { title: "Recruiting Coordinator", department: "HR", type: "Full-time", location: "Austin, TX", posted: "1 week ago", description: "Create a warm, organized candidate experience by coordinating interviews and partnering with recruiters and hiring teams." },
  { title: "Inventory Control Specialist", department: "Logistics", type: "Full-time", location: "Round Rock, TX", posted: "8 days ago", description: "Maintain reliable inventory records, investigate variances, and work with warehouse teams to improve stock accuracy." },
  { title: "Payroll Administrator", department: "Finance", type: "Full-time", location: "Austin, TX", posted: "9 days ago", description: "Help deliver accurate payroll by maintaining employee records, reviewing time data, and responding to payroll questions." },
  { title: "Distribution Planner", department: "Logistics", type: "Full-time", location: "Georgetown, TX", posted: "10 days ago", description: "Plan efficient product flow across our network and collaborate with carriers and internal teams to keep deliveries on track." },
  { title: "Business Operations Analyst", department: "Operations", type: "Full-time", location: "Austin, TX", posted: "11 days ago", description: "Use operational data and process mapping to surface improvement opportunities and help teams put them into practice." },
  { title: "Benefits Assistant", department: "HR", type: "Part-time", location: "Austin, TX", posted: "12 days ago", description: "Support benefits administration and help employees find clear answers about their programs and enrollment." },
  { title: "Forklift Operator", department: "Logistics", type: "Full-time", location: "Round Rock, TX", posted: "2 weeks ago", description: "Move and stage product safely and efficiently while supporting receiving, replenishment, and outbound teams." },
  { title: "Staff Accountant", department: "Finance", type: "Full-time", location: "Austin, TX", posted: "2 weeks ago", description: "Contribute to month-end close, account reconciliations, and financial reporting in a growing finance organization." },
  { title: "Facilities Coordinator", department: "Operations", type: "Full-time", location: "Austin, TX", posted: "2 weeks ago", description: "Coordinate maintenance, vendor visits, and workplace projects to keep our facilities safe and ready for teams." },
  { title: "HR Generalist", department: "HR", type: "Full-time", location: "Austin, TX", posted: "15 days ago", description: "Partner with managers and employees on day-to-day people needs, policies, and a consistent employee experience." },
  { title: "Shipping & Receiving Clerk", department: "Logistics", type: "Part-time", location: "Georgetown, TX", posted: "16 days ago", description: "Check incoming deliveries, prepare shipping documentation, and keep dock activity organized and accurate." },
  { title: "Treasury Analyst", department: "Finance", type: "Full-time", location: "Austin, TX", posted: "17 days ago", description: "Support cash planning, daily treasury operations, and reporting that helps the business make informed decisions." },
  { title: "Process Improvement Lead", department: "Operations", type: "Full-time", location: "Round Rock, TX", posted: "18 days ago", description: "Bring teams together to simplify workflows, measure results, and make improvements that last." },
  { title: "Learning & Development Partner", department: "HR", type: "Full-time", location: "Austin, TX", posted: "3 weeks ago", description: "Build practical learning experiences that help employees grow their skills and support leaders across the organization." },
  { title: "Fleet Support Coordinator", department: "Logistics", type: "Full-time", location: "Austin, TX", posted: "3 weeks ago", description: "Coordinate fleet schedules, service records, and communication to keep deliveries moving reliably." },
  { title: "Financial Operations Associate", department: "Finance", type: "Full-time", location: "Austin, TX", posted: "24 days ago", description: "Connect financial processes across teams, resolve account questions, and contribute to a dependable close cycle." },
  { title: "Workforce Scheduling Coordinator", department: "Operations", type: "Part-time", location: "Round Rock, TX", posted: "26 days ago", description: "Build clear team schedules, support coverage planning, and communicate changes across a busy operation." },
];

const departments = ["All", "Logistics", "Finance", "Operations", "HR"] as const;
const pageSize = 5;

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="8.7" cy="8.7" r="5.7" stroke="currentColor" strokeWidth="1.7" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 8.2c0 4.3-6 9-6 9s-6-4.7-6-9a6 6 0 1 1 12 0Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function BriefcaseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 12h16m-10 0v2h4v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function JobBoard({ initialDepartment = "All" }: { initialDepartment?: (typeof departments)[number] }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState({ keyword: "", location: "" });
  const [department, setDepartment] = useState<(typeof departments)[number]>(initialDepartment);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    const matching = jobs.filter((job) => {
      const matchesDepartment = department === "All" || job.department === department;
      const searchableText = `${job.title} ${job.department} ${job.type}`.toLowerCase();
      const matchesKeyword = searchableText.includes(query.keyword.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(query.location.toLowerCase());
      return matchesDepartment && matchesKeyword && matchesLocation;
    });
    return matching.sort((first, second) => sort === "alphabetical" ? first.title.localeCompare(second.title) : jobs.indexOf(first) - jobs.indexOf(second));
  }, [department, query, sort]);

  const pageCount = Math.ceil(filteredJobs.length / pageSize);
  const visibleJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (!selectedJob) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedJob(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedJob]);

  function searchJobs(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery({ keyword: keyword.trim(), location: location.trim() });
    setPage(1);
  }

  function goToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), Math.max(pageCount, 1));
    setPage(safePage);
    document.getElementById("jobs-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const firstResult = filteredJobs.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filteredJobs.length);

  return (
    <main className="main-content jobs-page">
      <section className="intro" aria-labelledby="page-title">
        <div className="intro-kicker"><span /> CAREERS AT BLUETECH</div>
        <div className="intro-heading-row">
          <div>
            <h1 id="page-title">Open Positions</h1>
            <p className="intro-copy">Find your next opportunity and do work that moves us forward.</p>
          </div>
          <div className="open-count"><strong>24</strong><span>roles open</span></div>
        </div>

        <form className="search-panel" onSubmit={searchJobs}>
          <label className="search-field keyword-field"><SearchIcon /><span className="sr-only">Search by keyword</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title, keyword, or team" /></label>
          <span className="search-divider" />
          <label className="search-field location-field"><PinIcon /><span className="sr-only">Search by location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or region" /></label>
          <button className="search-button" type="submit"><SearchIcon /> Search</button>
        </form>
      </section>

      <section id="jobs-results" className="jobs-section" aria-label="Job listings">
        <div className="list-toolbar">
          <div className="filter-list" role="group" aria-label="Filter by department">
            {departments.map((item) => <button key={item} type="button" onClick={() => { setDepartment(item); setPage(1); }} className={`filter-chip${department === item ? " selected" : ""}`} aria-pressed={department === item}>{item}{item === "All" ? <span className="chip-count">24</span> : null}</button>)}
          </div>
          <label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort jobs"><option value="newest">Most recent</option><option value="alphabetical">A to Z</option></select></label>
        </div>

        <div className="results-caption" aria-live="polite"><span>{filteredJobs.length ? `Showing ${firstResult}–${lastResult} of ${filteredJobs.length} positions` : "No positions found"}</span><span className="results-location">Austin, TX <span className="status-dot" /></span></div>

        <div className="job-list">
          {visibleJobs.map((job) => <article className="job-card" key={job.title}>
            <div className={`job-icon icon-tone-${(jobs.indexOf(job) % 4) + 1}`}><BriefcaseIcon /></div>
            <div className="job-details">
              <div className="job-title-line"><h2>{job.title}</h2><span className="job-posted">{job.posted}</span></div>
              <div className="job-meta"><span className="job-tag type-tag">{job.type}</span><span className="job-tag department-tag">{job.department}</span><span className="job-location"><PinIcon />{job.location}</span></div>
            </div>
            <button className="view-button" type="button" onClick={() => setSelectedJob(job)} aria-label={`View ${job.title}`}>View job <span aria-hidden="true">↗</span></button>
          </article>)}
          {visibleJobs.length === 0 && <div className="empty-state"><span className="empty-icon"><SearchIcon /></span><h2>No matching positions</h2><p>Try another keyword or location, or choose a different department.</p><button type="button" onClick={() => { setKeyword(""); setLocation(""); setQuery({ keyword: "", location: "" }); setDepartment("All"); setPage(1); }}>Clear filters</button></div>}
        </div>

        {pageCount > 1 && <nav className="pagination" aria-label="Job listing pages">
          <button className="page-arrow" type="button" aria-label="Previous page" disabled={page === 1} onClick={() => goToPage(page - 1)}>‹</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" className={`page-number${page === pageNumber ? " current" : ""}`} aria-label={`Page ${pageNumber}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => goToPage(pageNumber)}>{pageNumber}</button>)}
          <button className="page-arrow" type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => goToPage(page + 1)}>›</button>
        </nav>}
      </section>

      {selectedJob && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedJob(null); }}>
        <section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" type="button" aria-label="Close job details" onClick={() => setSelectedJob(null)}>×</button>
          <div className="modal-icon"><BriefcaseIcon /></div>
          <p className="modal-kicker">BLUETECH CAREERS</p>
          <h2 id="modal-title">{selectedJob.title}</h2>
          <div className="job-meta modal-meta"><span className="job-tag type-tag">{selectedJob.type}</span><span className="job-tag department-tag">{selectedJob.department}</span><span className="job-location"><PinIcon />{selectedJob.location}</span></div>
          <p className="modal-description">{selectedJob.description}</p>
          <div className="modal-bottom"><span>Posted {selectedJob.posted}</span><a href={`mailto:careers@bluetech.example?subject=${encodeURIComponent(`Application: ${selectedJob.title}`)}`}>Contact recruiting <span aria-hidden="true">↗</span></a></div>
        </section>
      </div>}
    </main>
  );
}