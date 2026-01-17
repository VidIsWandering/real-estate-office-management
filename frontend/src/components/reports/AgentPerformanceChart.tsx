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

const data = [
  { agent: "Alice Chen", sales: 28, revenue: 8500000 },
  { agent: "Bob Smith", sales: 22, revenue: 6200000 },
  { agent: "Carol Davis", sales: 25, revenue: 7800000 },
  { agent: "David Lee", sales: 19, revenue: 5900000 },
  { agent: "Emma Wilson", sales: 31, revenue: 9200000 },
];

export function AgentPerformanceChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Agent Performance Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="agent"
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
            formatter={(value) => {
              if (typeof value === "number" && value > 100) {
                return `$${(value / 1000000).toFixed(1)}M`;
              }
              return `${value} sales`;
            }}
          />
          <Bar dataKey="revenue" fill="#1A73E8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-gray-600 text-center">
        Showing total revenue by agent
      </div>
    </div>
  );
}
