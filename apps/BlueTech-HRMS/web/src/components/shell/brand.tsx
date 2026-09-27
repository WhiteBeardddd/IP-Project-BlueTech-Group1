import Link from "next/link";
import { UsersRound } from "lucide-react";

export default function Brand({ href }: { href: string }) {
  return (
    <Link className="brand" href={href} aria-label="BlueTech HRMS home">
      <span className="brand-mark"><UsersRound aria-hidden="true" strokeWidth={1.75} /></span>
      <span className="brand-copy"><strong>BlueTech</strong><span>HRMS</span></span>
    </Link>
  );
}
