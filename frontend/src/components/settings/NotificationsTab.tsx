"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getAllSystemConfigs, updateSystemConfig } from "@/lib/api";

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

const STORAGE_KEY = "notification_pending_save";
const CACHE_KEY = "notification_settings_cache";

export function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    // Try to load from cache first
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // Ignore parse errors
        }
      }
    }
    return {
      email: false,
      sms: false,
      push: false,
    };
  });

  const [savedSettings, setSavedSettings] = useState<NotificationSettings>(
    () => {
      // Try to load from cache first
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch {
            // Ignore parse errors
          }
        }
      }
      return {
        email: false,
        sms: false,
        push: false,
      };
    }
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load notification configs on mount
  useEffect(() => {
    const loadData = async () => {
      // Check if there was a pending save that just completed
      const pendingSave = sessionStorage.getItem(STORAGE_KEY);
      if (pendingSave) {
        // Don't load from server, use the pending save data
        try {
          const data = JSON.parse(pendingSave);
          setSettings(data);
          setSavedSettings(data);
          setLoading(false);
          // Clear the pending flag
          sessionStorage.removeItem(STORAGE_KEY);
          return;
        } catch {
          // If parse fails, fall through to normal load
        }
      }

      // Check if we have fresh cache (within last 5 seconds)
      const cacheTimestamp = sessionStorage.getItem(CACHE_KEY + "_timestamp");
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        if (age < 5000) {
          // 5 seconds
          // Use cache, don't load from server
          setLoading(false);
          return;
        }
      }

      // Load from server
      loadNotificationConfigs();
    };
    loadData();
  }, []);

  // Detect changes
  useEffect(() => {
    setHasChanges(
      settings.email !== savedSettings.email ||
        settings.sms !== savedSettings.sms ||
        settings.push !== savedSettings.push
    );
  }, [settings, savedSettings]);

  const loadNotificationConfigs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const response = await getAllSystemConfigs();

      // Extract notification-related configs
      const configs = response.data;
      const data: NotificationSettings = {
        email:
          (configs.find((c) => c.key === "notification_email")
            ?.value as boolean) || false,
        sms:
          (configs.find((c) => c.key === "notification_sms")
            ?.value as boolean) || false,
        push:
          (configs.find((c) => c.key === "notification_push")
            ?.value as boolean) || false,
      };

      setSettings(data);
      setSavedSettings(data);

      // Update cache with timestamp
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      sessionStorage.setItem(CACHE_KEY + "_timestamp", Date.now().toString());
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notification settings"
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleChange = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Capture current settings to save
      const settingsToSave = { ...settings };

      // Immediately update cache with the values we're about to save
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(settingsToSave));
      sessionStorage.setItem(CACHE_KEY + "_timestamp", Date.now().toString());

      // Mark that we have a pending save (store the data itself)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));

      // Update each notification config
      await Promise.all([
        updateSystemConfig("notification_email", settingsToSave.email),
        updateSystemConfig("notification_sms", settingsToSave.sms),
        updateSystemConfig("notification_push", settingsToSave.push),
      ]);

      // Update savedSettings to match what we just saved
      setSavedSettings(settingsToSave);

      // Clear the pending save flag
      sessionStorage.removeItem(STORAGE_KEY);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      // On error, clear cache and pending flag, then reload
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(CACHE_KEY + "_timestamp");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save notification settings"
      );
      // On error, reload to get correct state and update cache
      await loadNotificationConfigs(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">Notification Preferences</h2>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Notification preferences saved successfully</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 text-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.email}
            onChange={() => handleChange("email")}
            disabled={saving}
            className="h-4 w-4"
          />
          <span>Email notifications</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sms}
            onChange={() => handleChange("sms")}
            disabled={saving}
            className="h-4 w-4"
          />
          <span>SMS notifications</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.push}
            onChange={() => handleChange("push")}
            disabled={saving}
            className="h-4 w-4"
          />
          <span>App push notifications</span>
        </label>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
