import type { Metadata } from "next";
import { db } from "@/lib/db";
import SettingsForm from "@/components/studio/SettingsForm";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await db.settings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Settings</h1>
      <div className="mt-8">
        <SettingsForm
          defaultTimezone={settings.defaultTimezone}
          defaultEmailDelayMinutes={settings.defaultEmailDelayMinutes}
          emailProvider={settings.emailProvider}
        />
      </div>
    </div>
  );
}
