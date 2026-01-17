"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { AccountTab } from "@/components/settings/account/AccountTab";
import { OfficeTab } from "@/components/settings/OfficeTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { ConfigTab } from "@/components/settings/ConfigTab";

type TabKey =
  | "account"
  | "office"
  | "notifications"
  | "security"
  | "integrations"
  | "config";

const VALID_TABS: TabKey[] = [
  "account",
  "office",
  "notifications",
  "security",
  "integrations",
  "config",
];

export default function SettingsClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;

  const [tab, setTab] = useState<TabKey>("account");

  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="space-y-8">
      <SettingsHeader />
      <SettingsTabs activeTab={tab} onChange={setTab} />

      {tab === "account" && <AccountTab />}
      {tab === "office" && <OfficeTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "integrations" && <IntegrationsTab />}
      {tab === "config" && <ConfigTab />}
    </div>
  );
}
