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
  { agent: "Alice Chen", sales: 24 },
  { agent: "Bob Smith", sales: 18 },
  { agent: "Carol Davis", sales: 22 },
  { agent: "David Lee", sales: 19 },
  { agent: "Emma Wilson", sales: 26 },
  { agent: "Frank Brown", sales: 20 },
];

export function SalesChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Sales Performance by Agent
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
            formatter={(value) => `${value} sales`}
          />
          <Bar dataKey="sales" fill="#1A73E8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
