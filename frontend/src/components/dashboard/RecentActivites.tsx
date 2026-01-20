"use client";

import { User, FileText, Eye, Calendar } from "lucide-react";
import type { DashboardRecentTransaction } from "@/lib/api/reports";

type ActivityType = "sale" | "rent" | "contract" | "other";

function toActivityType(type: string | null): ActivityType {
  const t = (type ?? "").toLowerCase();
  if (t.includes("rent")) return "rent";
  if (t.includes("sale") || t.includes("sell")) return "sale";
  if (t.includes("contract")) return "contract";
  return "other";
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "sale":
      return <FileText className="w-4 h-4" />;
    case "rent":
      return <Eye className="w-4 h-4" />;
    case "contract":
      return <Calendar className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
}

function getActivityColor(type: ActivityType) {
  switch (type) {
    case "sale":
      return "bg-blue-50 text-blue-600";
    case "rent":
      return "bg-orange-50 text-orange-600";
    case "contract":
      return "bg-purple-50 text-purple-600";
    default:
      return "bg-green-50 text-green-600";
  }
}

function formatVnd(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
}

interface RecentActivitiesProps {
  items?: DashboardRecentTransaction[];
  loading?: boolean;
}

export function RecentActivities({
  items = [],
  loading,
}: RecentActivitiesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No data.</div>
        ) : (
          items.map((item) => {
            const activityType = toActivityType(item.type);
            return (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${getActivityColor(activityType)}`}
                  >
                    {getActivityIcon(activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.property.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.agent.fullName} • {formatVnd(item.amount)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap ml-2">
                    {formatDate(item.date)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Activities →
        </button>
      </div>
    </div>
  );
}
