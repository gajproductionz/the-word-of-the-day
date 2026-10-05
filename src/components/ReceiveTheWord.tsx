"use client";

import { useState, FormEvent } from "react";

interface ReceiveTheWordProps {
  variant?: "light" | "dark";
  heading?: string;
  subheading?: string;
  className?: string;
}

export default function ReceiveTheWord({
  variant = "light",
  heading = "START YOUR MORNING WITH THE WORD.",
  subheading = "Scripture. Reflection. Prayer. Delivered every morning.",
  className = "",
}: ReceiveTheWordProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isDark = variant === "dark";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, channel: "email" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("You're in. Look for your first Word tomorrow morning.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div
      id="receive-the-word"
      className={`mx-auto max-w-xl text-center ${className}`}
    >
      <h2
        className={`font-serif text-3xl leading-[1.1] sm:text-4xl ${
          isDark ? "text-ivory" : "text-charcoal"
        }`}
      >
        {heading}
      </h2>
      <p
        className={`mt-4 font-sans text-sm sm:text-base ${
          isDark ? "text-ivory/70" : "text-charcoal/70"
        }`}
      >
        {subheading}
      </p>

      {status === "success" ? (
        <p
          className={`mt-8 font-serif text-lg italic ${isDark ? "text-gold-soft" : "text-forest"}`}
          role="status"
        >
          {message}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
          noValidate
        >
          <label htmlFor="receive-email" className="sr-only">
            Email address
          </label>
          <input
            id="receive-email"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-full border px-5 py-3 font-sans text-sm outline-none transition-colors sm:w-72 ${
              isDark
                ? "border-ivory/25 bg-transparent text-ivory placeholder:text-ivory/40 focus:border-gold-soft"
                : "border-charcoal/20 bg-white/50 text-charcoal placeholder:text-charcoal/40 focus:border-forest"
            }`}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`whitespace-nowrap rounded-full px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] transition-opacity disabled:opacity-60 ${
              isDark ? "bg-gold text-near-black" : "bg-forest text-ivory"
            }`}
          >
            {status === "loading" ? "SENDING…" : "SEND ME THE WORD →"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}
      <p className={`mt-4 text-xs ${isDark ? "text-ivory/60" : "text-charcoal/60"}`}>
        One email each morning. Unsubscribe anytime.
      </p>
    </div>
  );
}
