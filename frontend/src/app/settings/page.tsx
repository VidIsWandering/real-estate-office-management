import { Suspense } from "react";
import SettingsClient from "@/components/settings/SettingsClient";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading settings...</div>}>
      <SettingsClient />
    </Suspense>
  );
}
