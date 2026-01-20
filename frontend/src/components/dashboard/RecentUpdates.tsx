"use client";

import { ArrowRight, Home, CheckCircle2, AlertCircle } from "lucide-react";
import type { DashboardTopProperty } from "@/lib/api/reports";

function formatVnd(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")} VND`;
}

function getStatusIcon(status: DashboardTopProperty["status"]) {
  switch (status) {
    case "transacted":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "pending_legal_check":
    case "negotiating":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    default:
      return <Home className="w-5 h-5 text-blue-600" />;
  }
}

function getStatusLabel(status: DashboardTopProperty["status"]) {
  const labels: Record<DashboardTopProperty["status"], string> = {
    created: "Created",
    pending_legal_check: "Legal Check",
    listed: "Listed",
    negotiating: "Negotiating",
    transacted: "Transacted",
    suspended: "Suspended",
  };
  return labels[status] ?? status;
}

function getStatusColor(status: DashboardTopProperty["status"]) {
  const colors: Partial<Record<DashboardTopProperty["status"], string>> = {
    transacted: "bg-green-50 text-green-700",
    listed: "bg-blue-50 text-blue-700",
    negotiating: "bg-yellow-50 text-yellow-700",
    pending_legal_check: "bg-yellow-50 text-yellow-700",
    suspended: "bg-red-50 text-red-700",
    created: "bg-gray-50 text-gray-700",
  };
  return colors[status] ?? "bg-gray-50 text-gray-700";
}

interface RecentUpdatesProps {
  items?: DashboardTopProperty[];
  loading?: boolean;
}

export function RecentUpdates({ items = [], loading }: RecentUpdatesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Properties</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No data.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.location ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(item.status)}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                {formatVnd(item.price)}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Updates →
        </button>
      </div>
    </div>
  );
}
