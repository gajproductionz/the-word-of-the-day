import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">404</p>
      <h1 className="mt-5 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
        This page has wandered off.
      </h1>
      <p className="mt-5 max-w-sm font-serif italic text-charcoal/60">
        But there is still a Word for you today.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-forest px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-ivory transition-colors hover:bg-forest-light"
      >
        RETURN HOME
      </Link>
    </div>
  );
}
