import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import StudioNav from "@/components/studio/StudioNav";

/**
 * Second auth check (middleware.ts is the first) — defense in depth, and
 * it's what gives this layout the admin's name to display without an
 * extra client-side fetch.
 */
export default async function StudioDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/studio/login");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">
        <StudioNav adminName={session.name || session.email} />
      </div>
      <main className="px-5 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  );
}
