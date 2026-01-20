"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { AgentPerformanceChartItem } from "@/lib/api/reports";

interface SalesChartProps {
  data?: AgentPerformanceChartItem[];
  loading?: boolean;
}

export function SalesChart({ data = [], loading }: SalesChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Sales Performance by Agent
      </h3>

      {!loading && data.length === 0 ? (
        <div className="text-sm text-gray-500">No data.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="agentName"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#111827" }}
              formatter={(value) => `${value} sales`}
            />
            <Bar dataKey="sales" fill="#1A73E8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
