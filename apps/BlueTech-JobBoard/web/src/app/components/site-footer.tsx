import Link from "next/link";

export default function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner"><span>© 2025 BlueTech</span><span>Building what moves us forward.</span><Link href="/about">About BlueTech <span aria-hidden="true">↗</span></Link></div></footer>;
}