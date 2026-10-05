"use client";

import { useState } from "react";
import { COMMON_TIMEZONES, zonedTimeToUtc } from "@/lib/date";

interface ScheduleModalProps {
  defaultTimezone?: string;
  defaultEmailDelayMinutes?: number;
  onConfirm: (publishAt: string, emailSendAt: string | null, pushSendAt: string | null) => void | Promise<void>;
  onCancel: () => void;
}

export default function ScheduleModal({
  defaultTimezone = "America/New_York",
  defaultEmailDelayMinutes = 30,
  onConfirm,
  onCancel,
}: ScheduleModalProps) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("05:30");
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [emailDelay, setEmailDelay] = useState(defaultEmailDelayMinutes);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const publishAt = zonedTimeToUtc(date, time, timezone);
    const emailSendAt = new Date(publishAt.getTime() + emailDelay * 60000);
    try {
      await onConfirm(publishAt.toISOString(), emailSendAt.toISOString(), publishAt.toISOString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-near-black/60 px-5">
      <div className="w-full max-w-md rounded-sm bg-ivory p-8">
        <p className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-ink">SCHEDULE THIS WORD</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              DATE
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              TIME
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
            TIMEZONE
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

        <div className="mt-4">
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
            SEND EMAIL (MINUTES AFTER PUBLISH)
          </label>
          <input
            type="number"
            min={0}
            value={emailDelay}
            onChange={(e) => setEmailDelay(Number(e.target.value))}
            className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
          />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-forest px-5 py-3 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light disabled:opacity-60"
          >
            {loading ? "SCHEDULING…" : "CONFIRM SCHEDULE"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-charcoal/20 px-5 py-3 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
