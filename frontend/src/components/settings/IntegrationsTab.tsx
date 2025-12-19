"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link2, XCircle } from "lucide-react";

interface Integration {
  key: "google" | "slack" | "zoom";
  name: string;
  description: string;
}

const integrations: Integration[] = [
  {
    key: "google",
    name: "Google Calendar",
    description: "Đồng bộ lịch hẹn và sự kiện",
  },
  {
    key: "slack",
    name: "Slack Notifications",
    description: "Gửi thông báo nội bộ qua Slack",
  },
  {
    key: "zoom",
    name: "Zoom Meetings",
    description: "Tạo và quản lý cuộc họp Zoom",
  },
];

export function IntegrationsTab() {
  // 🔥 sau này load từ API
  const [connected, setConnected] = useState<
    Record<Integration["key"], boolean>
  >({
    google: false,
    slack: true,
    zoom: false,
  });

  const handleConnect = (key: Integration["key"]) => {
    console.log("CONNECT:", key);
    // TODO: redirect OAuth / API connect
    setConnected((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleDisconnect = (key: Integration["key"]) => {
    if (!window.confirm("Bạn có chắc chắn muốn ngắt kết nối?")) return;

    console.log("DISCONNECT:", key);
    // TODO: call API disconnect
    setConnected((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Integrations</h2>

      <ul className="space-y-4">
        {integrations.map((item) => {
          const isConnected = connected[item.key];

          return (
            <li
              key={item.key}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>

              <div className="flex items-center gap-3">
                {isConnected ? (
                  <>
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(item.key)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(item.key)}>
                    <Link2 className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
