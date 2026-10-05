"use client";

import { useState } from "react";
import { COMMON_TIMEZONES } from "@/lib/date";

interface SettingsFormProps {
  defaultTimezone: string;
  defaultEmailDelayMinutes: number;
  emailProvider: string;
}

export default function SettingsForm({
  defaultTimezone: initialTz,
  defaultEmailDelayMinutes: initialDelay,
  emailProvider,
}: SettingsFormProps) {
  const [timezone, setTimezone] = useState(initialTz);
  const [delay, setDelay] = useState(initialDelay);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [pwError, setPwError] = useState("");

  async function saveGeneral() {
    await fetch("/api/studio/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultTimezone: timezone, defaultEmailDelayMinutes: delay }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function changePassword() {
    setPwStatus("saving");
    setPwError("");
    try {
      const res = await fetch("/api/studio/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwStatus("done");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwStatus("error");
      setPwError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="max-w-xl space-y-12">
      <section>
        <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">
          SCHEDULING DEFAULTS
        </p>
        <p className="mt-2 font-sans text-sm text-charcoal/60">
          Used whenever you schedule a Word, so timing is never assumed from your device&apos;s timezone.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              DEFAULT TIMEZONE
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              EMAIL DELAY (MINUTES AFTER PUBLISH)
            </label>
            <input
              type="number"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={saveGeneral}
          className="mt-4 rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
        >
          {saved ? "SAVED" : "SAVE"}
        </button>
      </section>

      <section>
        <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">EMAIL PROVIDER</p>
        <p className="mt-2 font-sans text-sm text-charcoal/60">
          Currently <span className="font-semibold text-charcoal">{emailProvider}</span> — logs instead of
          sending. Connect a real provider (Resend, Postmark, SES…) in{" "}
          <code className="rounded bg-charcoal/5 px-1">src/lib/email/providers</code>.
        </p>
      </section>

      <section>
        <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">CHANGE PASSWORD</p>
        <div className="mt-4 space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-2.5 font-sans text-sm outline-none focus:border-forest"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-2.5 font-sans text-sm outline-none focus:border-forest"
          />
          {pwStatus === "error" && <p className="font-sans text-sm text-red-700">{pwError}</p>}
          {pwStatus === "done" && <p className="font-sans text-sm text-forest">Password updated.</p>}
          <button
            type="button"
            onClick={changePassword}
            disabled={pwStatus === "saving" || !currentPassword || !newPassword}
            className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest disabled:opacity-50"
          >
            {pwStatus === "saving" ? "UPDATING…" : "UPDATE PASSWORD"}
          </button>
        </div>
      </section>
    </div>
  );
}
