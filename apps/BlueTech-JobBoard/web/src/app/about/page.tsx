import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | BlueTech Careers",
  description: "Learn about the people and purpose behind BlueTech.",
};

export default function AboutPage() {
  return <main className="main-content about-page">
    <section className="about-intro">
      <div className="intro-kicker"><span /> ABOUT BLUETECH</div>
      <h1>Make progress<br />mean something.</h1>
      <p>We bring thoughtful people together to solve practical problems and make everyday work better for the teams and communities we serve.</p>
      <Link className="search-button about-cta" href="/jobs">Explore open positions <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-label">OUR APPROACH</div>
      <div className="about-story-copy"><h2 id="about-story-title">A better way forward is built together.</h2><p>BlueTech is a growing operations and technology company with teams across logistics, finance, operations, and people services. We value clear thinking, dependable work, and the kind of collaboration that turns good ideas into useful outcomes.</p><p>Whether you are supporting a distribution team or shaping how our people work, your contribution helps the whole organization move forward.</p></div>
    </section>
    <section className="values-section" aria-labelledby="values-title">
      <div className="values-heading"><div className="about-label">WHAT GUIDES US</div><h2 id="values-title">Good work, done with care.</h2></div>
      <div className="values-list">
        <article className="value-row"><span className="value-index">01</span><div><h3>People first</h3><p>We listen, share context, and make room for people to do their best work.</p></div></article>
        <article className="value-row"><span className="value-index">02</span><div><h3>Own the outcome</h3><p>We follow through, learn from the details, and take responsibility for what we deliver.</p></div></article>
        <article className="value-row"><span className="value-index">03</span><div><h3>Keep improving</h3><p>We stay curious and make practical changes that help work better tomorrow.</p></div></article>
      </div>
    </section>
    <section className="about-contact"><p>Ready to make your next move?</p><Link href="/jobs">Find your role <span aria-hidden="true">↗</span></Link></section>
  </main>;
}