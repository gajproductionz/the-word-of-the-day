"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

type Status = "idle" | "requesting" | "subscribed" | "unsupported" | "denied" | "error";

export default function PushOptIn() {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    // One-time read of client-only browser capability/permission state
    // after mount, to avoid a server/client hydration mismatch — not
    // syncing to an external store on every render.
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then(async (reg) => {
        const sub = await reg?.pushManager.getSubscription();
        if (sub) setStatus("subscribed");
      });
    } else if (Notification.permission === "denied") {
      setStatus("denied");
    }
  }, []);

  async function handleRemindMe() {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    try {
      // The browser's native permission prompt only ever appears from
      // here — after the visitor has already read what it's for and
      // chosen to click, never on page load.
      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "idle");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setStatus("subscribed");
    } catch {
      setStatus("error");
    }
  }

  if (status === "unsupported") return null;

  return (
    <div className="mx-auto max-w-md text-center">
      {status === "subscribed" ? (
        <p className="font-serif text-lg italic text-forest">
          You&apos;re set — we&apos;ll send a gentle reminder when today&apos;s Word is ready.
        </p>
      ) : (
        <>
          <h3 className="font-serif text-2xl text-charcoal">NEVER MISS YOUR WORD.</h3>
          <p className="mt-2 font-sans text-sm text-charcoal/60">
            Allow a gentle reminder when today&apos;s Word is ready.
          </p>
          <button
            type="button"
            onClick={handleRemindMe}
            disabled={status === "requesting"}
            className="mt-5 rounded-full border border-charcoal/20 px-6 py-3 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal transition-colors hover:border-forest hover:text-forest disabled:opacity-60"
          >
            {status === "requesting" ? "…" : "🔔 REMIND ME"}
          </button>
          {status === "denied" && (
            <p className="mt-3 font-sans text-xs text-charcoal/50">
              Notifications are blocked for this site in your browser settings.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 font-sans text-xs text-red-700">Something went wrong — please try again.</p>
          )}
        </>
      )}
    </div>
  );
}
