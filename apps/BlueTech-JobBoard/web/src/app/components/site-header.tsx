"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BriefcaseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 12h16m-10 0v2h4v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/about", label: "About" },
  ];

  return <header className="topbar">
    <div className="topbar-inner">
      <Link className="brand" href="/" aria-label="BlueTech Job Board home">
        <span className="brand-mark"><BriefcaseIcon /></span>
        <span className="brand-copy"><strong>BlueTech</strong><span>JOB BOARD</span></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(({ href, label }) => <Link key={href} className={`nav-link${pathname === href ? " active" : ""}`} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
      </nav>
      <Link className="header-note" href="/jobs"><span className="status-dot" /> Careers at BlueTech</Link>
    </div>
  </header>;
}