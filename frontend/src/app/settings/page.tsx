"use client";

import { useState } from "react";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

import { AccountTab } from "@/components/settings/account/AccountTab";
import { OfficeTab } from "@/components/settings/OfficeTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";

export default function SettingsPage() {
  const [tab, setTab] = useState<
    "account" | "office" | "notifications" | "security" | "integrations"
  >("account");

  return (
    <div className="space-y-8">
      <SettingsHeader />
      <SettingsTabs activeTab={tab} onChange={setTab} />

      {tab === "account" && <AccountTab />}
      {tab === "office" && <OfficeTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "integrations" && <IntegrationsTab />}
    </div>
  );
}
