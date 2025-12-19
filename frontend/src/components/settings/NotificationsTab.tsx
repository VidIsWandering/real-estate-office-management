"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export function NotificationsTab() {
  // 🔥 giả lập data từ API
  const initialSettings: NotificationSettings = {
    email: true,
    sms: false,
    push: true,
  };

  const [settings, setSettings] =
    useState<NotificationSettings>(initialSettings);

  const [savedSettings, setSavedSettings] =
    useState<NotificationSettings>(initialSettings);

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /* ===== detect changes ===== */
  useEffect(() => {
    setHasChanges(
      settings.email !== savedSettings.email ||
        settings.sms !== savedSettings.sms ||
        settings.push !== savedSettings.push,
    );
  }, [settings, savedSettings]);

  const handleChange = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    console.log("SAVE NOTIFICATION SETTINGS:", settings);

    // ⏳ giả lập API
    await new Promise((resolve) => setTimeout(resolve, 800));

    // ✅ coi như API save thành công
    setSavedSettings(settings);
    setIsSaving(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">Notification Preferences</h2>

      <div className="space-y-4 text-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.email}
            onChange={() => handleChange("email")}
            className="h-4 w-4"
          />
          <span>Email notifications</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sms}
            onChange={() => handleChange("sms")}
            className="h-4 w-4"
          />
          <span>SMS notifications</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.push}
            onChange={() => handleChange("push")}
            className="h-4 w-4"
          />
          <span>App push notifications</span>
        </label>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
