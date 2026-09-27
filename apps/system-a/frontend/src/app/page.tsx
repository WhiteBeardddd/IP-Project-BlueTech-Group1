import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers at BlueTech",
  description: "Find work that moves us forward. Explore careers at BlueTech.",
};

const teams = [
  { name: "Logistics", roles: "7 open roles", number: "01" },
  { name: "Finance", roles: "6 open roles", number: "02" },
  { name: "Operations", roles: "6 open roles", number: "03" },
  { name: "People & Culture", roles: "5 open roles", number: "04" },
];

export default function HomePage() {
  return <main className="main-content home-page">
    <section className="home-hero">
      <div className="hero-copy">
        <div className="intro-kicker"><span /> CAREERS AT BLUETECH</div>
        <h1>Good work<br />moves us <em>forward.</em></h1>
        <p>Bring your perspective. Build practical solutions. Find a place where your work makes a difference to the people around you.</p>
        <div className="hero-actions"><Link className="search-button" href="/jobs">Explore open roles <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/about">Get to know us <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="hero-aside" aria-label="BlueTech careers overview">
        <div className="hero-aside-top"><span className="status-dot" /> GROW WITH US</div>
        <div className="hero-stat"><strong>24</strong><span>ways to make<br />an impact</span></div>
        <div className="hero-rule" />
        <div className="hero-aside-bottom"><span>01 / 04</span><span>Teams that keep<br />business moving</span></div>
        <div className="hero-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
    </section>

    <section className="home-teams" aria-labelledby="teams-title">
      <div className="section-heading">
        <div><div className="about-label">FIND YOUR PLACE</div><h2 id="teams-title">Different strengths.<br />One direction.</h2></div>
        <p>From the warehouse floor to the finance team, we bring together different skills to make better work happen.</p>
      </div>
      <div className="team-list">
        {teams.map((team) => <Link className="team-row" href={`/jobs?department=${encodeURIComponent(team.name === "People & Culture" ? "HR" : team.name)}`} key={team.number}>
          <span className="team-number">{team.number}</span><strong>{team.name}</strong><span className="team-roles">{team.roles}</span><span className="team-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>
    </section>

    <section className="home-callout"><div><div className="about-label">YOUR NEXT CHAPTER</div><h2>There’s room to do<br />your best work here.</h2></div><Link href="/jobs">See all open positions <span aria-hidden="true">↗</span></Link></section>
  </main>;
}
