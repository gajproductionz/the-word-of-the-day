import Link from "next/link";

const navLinks = [
  { href: "/", label: "Today" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/need-a-word", label: "I Need a Word" },
  { href: "/prayer", label: "Prayer" },
  { href: "/about", label: "About" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-lg leading-tight text-charcoal">
              THE WORD
              <br />
              OF THE DAY
            </p>
            <p className="mt-4 font-serif italic text-charcoal/70">
              A Word for today. Faith for the journey.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-xs font-medium tracking-[0.12em] text-charcoal/70 transition-colors hover:text-forest"
              >
                {l.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          <div className="flex gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-sans text-xs font-medium tracking-[0.12em] text-charcoal/60 transition-colors hover:text-forest"
                aria-label={s.label}
              >
                {s.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-charcoal/10 pt-6 text-xs text-charcoal/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Scripture quotations are from the King James Version (KJV).</p>
          <p>&copy; {new Date().getFullYear()} The Word of the Day. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
