"use client";

export function SecurityTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>

      <div className="space-y-4 text-sm">
        <div>
          <p className="font-medium">Change Password</p>
          <button className="mt-1 text-primary">Update Password</button>
        </div>

        <div>
          <p className="font-medium">Two-Factor Authentication</p>
          <button className="mt-1 text-primary">Enable 2FA</button>
        </div>
      </div>
    </div>
  );
}
