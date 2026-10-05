"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Prototype streak tracker, backed by localStorage. This stands in for a
 * future account-backed streak system — swap the read/write functions
 * below for API calls once user accounts exist; the component contract
 * (`{ streak, receivedToday, receiveToday }`) can stay the same.
 */
const STORAGE_KEY = "wordoftheday_streak";

interface StreakState {
  count: number;
  lastDate: string | null;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function readState(): StreakState {
  if (typeof window === "undefined") return { count: 0, lastDate: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lastDate: null };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { count: 0, lastDate: null };
  }
}

export function useStreak() {
  const [state, setState] = useState<StreakState>({ count: 0, lastDate: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time read of client-only localStorage after mount, to avoid a
    // server/client hydration mismatch — not syncing to an external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readState());
    setHydrated(true);
  }, []);

  const receiveToday = useCallback(() => {
    setState((prev) => {
      const today = todayISO();
      if (prev.lastDate === today) return prev;
      const gap = prev.lastDate ? daysBetween(prev.lastDate, today) : null;
      const nextCount = gap === 1 ? prev.count + 1 : 1;
      const next = { count: nextCount, lastDate: today };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable (private mode, etc.) — streak just won't persist
      }
      return next;
    });
  }, []);

  const receivedToday = hydrated && state.lastDate === todayISO();

  return { streak: state.count, receivedToday, receiveToday, hydrated };
}

export const streakMilestones = [
  { days: 7, label: "Stay Rooted" },
  { days: 30, label: "Growing in Faith" },
  { days: 100, label: "Walking in the Word" },
  { days: 365, label: "A Year With God" },
];
