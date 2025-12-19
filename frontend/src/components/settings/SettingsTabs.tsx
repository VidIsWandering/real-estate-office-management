"use client";

import {
  User,
  Bell,
  Lock,
  Building2,
  Plug2,
  SlidersHorizontal,
} from "lucide-react";

type TabKey =
  | "account"
  | "office"
  | "notifications"
  | "security"
  | "integrations"
  | "config";

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

export function SettingsTabs({ activeTab, onChange }: Props) {
  const tabs = [
    { key: "account", label: "Account", icon: <User className="w-4 h-4" /> },
    { key: "office", label: "Office", icon: <Building2 className="w-4 h-4" /> },
    {
      key: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    { key: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      key: "integrations",
      label: "Integrations",
      icon: <Plug2 className="w-4 h-4" />,
    },
    {
      key: "config",
      label: "Config",
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
  ];

  return (
    <div className="border-b">
      <div className="flex gap-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key as TabKey)}
            className={`flex items-center gap-2 px-2 py-3 text-sm font-medium transition-all
              ${
                activeTab === t.key
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
