// Web push service worker for The Word of the Day.
// Registered only after a visitor explicitly clicks "REMIND ME" — see
// src/components/PushOptIn.tsx. Never registered on page load.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "Good morning family ☀️";
  const options = {
    body: data.body || "Your Word is ready.",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(self.clients.openWindow(url));
});
