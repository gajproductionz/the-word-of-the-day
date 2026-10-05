"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/studio", label: "TODAY" },
  { href: "/studio/new", label: "NEW WORD" },
  { href: "/studio/devotionals", label: "DEVOTIONALS" },
  { href: "/studio/calendar", label: "CALENDAR" },
  { href: "/studio/series", label: "SERIES" },
  { href: "/studio/prayers", label: "PRAYERS" },
  { href: "/studio/need-a-word", label: "I NEED A WORD" },
  { href: "/studio/subscribers", label: "SUBSCRIBERS" },
  { href: "/studio/distribution", label: "DISTRIBUTION" },
  { href: "/studio/analytics", label: "ANALYTICS" },
  { href: "/studio/settings", label: "SETTINGS" },
];

export default function StudioNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/studio/auth/logout", { method: "POST" });
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col justify-between border-r border-charcoal/10 bg-ivory-deep/60 px-5 py-8">
      <div>
        <Link href="/studio" className="block">
          <p className="font-serif text-base leading-tight text-charcoal">
            THE WORD
            <br />
            OF THE DAY
          </p>
          <p className="mt-1 font-sans text-[0.65rem] font-semibold tracking-[0.2em] text-gold-ink">STUDIO</p>
        </Link>

        <ul className="mt-10 space-y-0.5">
          {navLinks.map((link) => {
            const active = link.href === "/studio" ? pathname === "/studio" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-sm px-3 py-2 font-sans text-xs font-semibold tracking-[0.1em] transition-colors ${
                    active ? "bg-forest text-ivory" : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          target="_blank"
          className="block font-sans text-xs font-semibold tracking-[0.1em] text-charcoal/60 hover:text-forest"
        >
          VIEW LIVE SITE ↗
        </Link>
        <div className="border-t border-charcoal/10 pt-3">
          <p className="font-sans text-xs text-charcoal/50">{adminName}</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-1 font-sans text-xs font-semibold tracking-[0.1em] text-charcoal/60 hover:text-forest disabled:opacity-50"
          >
            {signingOut ? "SIGNING OUT…" : "SIGN OUT"}
          </button>
        </div>
      </div>
    </nav>
  );
}
