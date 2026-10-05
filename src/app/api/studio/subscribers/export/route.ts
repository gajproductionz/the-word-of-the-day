import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["email", "status", "source", "signupDate", "unsubscribedDate"].join(",");
  const rows = subscribers.map((s) =>
    [
      csvEscape(s.email),
      s.emailStatus,
      csvEscape(s.source),
      s.createdAt.toISOString(),
      s.unsubscribedAt?.toISOString() ?? "",
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
