"use client";

export function IntegrationsTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Integrations</h2>

      <ul className="space-y-4 text-sm">
        <li className="flex justify-between">
          <span>Google Calendar</span>
          <button className="text-primary">Connect</button>
        </li>

        <li className="flex justify-between">
          <span>Slack Notifications</span>
          <button className="text-primary">Connect</button>
        </li>

        <li className="flex justify-between">
          <span>Zoom Meetings</span>
          <button className="text-primary">Connect</button>
        </li>
      </ul>
    </div>
  );
}
