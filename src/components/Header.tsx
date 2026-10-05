"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "TODAY" },
  { href: "/devotionals", label: "DEVOTIONALS" },
  { href: "/need-a-word", label: "I NEED A WORD" },
  { href: "/prayer", label: "PRAYER" },
  { href: "/about", label: "ABOUT" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close the mobile menu on navigation. This syncs local UI state to an
    // external signal (the route), which is exactly what effects are for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "bg-ivory/90 backdrop-blur-sm border-b border-charcoal/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-serif text-[0.95rem] leading-tight tracking-wide text-charcoal"
          aria-label="The Word of the Day, home"
        >
          <span className="block">THE WORD</span>
          <span className="block">OF THE DAY</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 font-sans text-[0.72rem] font-medium tracking-[0.14em] text-charcoal lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 transition-colors hover:text-forest"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/devotionals"
            aria-label="Search devotionals"
            className="hidden rounded-full p-2 text-charcoal transition-colors hover:text-forest sm:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/#receive-the-word"
            className="hidden rounded-full border border-charcoal/30 px-4 py-2 font-sans text-[0.68rem] font-semibold tracking-[0.14em] text-charcoal transition-colors hover:border-forest hover:text-forest md:inline-flex"
          >
            RECEIVE THE WORD
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={`h-px w-5 bg-charcoal transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-charcoal transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-[64px] z-40 origin-top bg-ivory transition-[transform,opacity] duration-[400ms] ease-out lg:hidden ${
          open ? "opacity-100 scale-y-100" : "pointer-events-none opacity-0 scale-y-95"
        }`}
        style={{ height: open ? "calc(100vh - 64px)" : undefined }}
      >
        <nav aria-label="Mobile" className="flex h-full flex-col justify-between px-6 py-10">
          <ul className="space-y-6">
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ transitionDelay: `${i * 40}ms` }}>
                <Link
                  href={link.href}
                  className="font-serif text-3xl text-charcoal transition-colors hover:text-forest"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#receive-the-word"
            className="w-full rounded-full bg-forest px-6 py-4 text-center font-sans text-[0.72rem] font-semibold tracking-[0.16em] text-ivory"
          >
            RECEIVE THE WORD →
          </Link>
        </nav>
      </div>
    </header>
  );
}
