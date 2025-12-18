"use client";

export function NotificationsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold">Notification Preferences</h2>

      <div className="space-y-4 text-sm">
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="h-4 w-4" />
          Email notifications
        </label>

        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4" />
          SMS notifications
        </label>

        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="h-4 w-4" />
          App push notifications
        </label>
      </div>
    </div>
  );
}
