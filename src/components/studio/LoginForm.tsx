"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/studio/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid email or password.");
      router.push(searchParams.get("next") || "/studio");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div>
        <label htmlFor="email" className="font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60">
          EMAIL
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-sans text-sm text-charcoal outline-none focus:border-forest"
        />
      </div>
      <div>
        <label htmlFor="password" className="font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-sans text-sm text-charcoal outline-none focus:border-forest"
        />
      </div>

      {status === "error" && (
        <p className="font-sans text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-forest px-6 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-ivory transition-colors hover:bg-forest-light disabled:opacity-60"
      >
        {status === "loading" ? "SIGNING IN…" : "SIGN IN"}
      </button>
    </form>
  );
}
