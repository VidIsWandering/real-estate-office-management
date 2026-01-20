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

import type { PropertySalesChartItem } from "@/lib/api/reports";

interface RevenueChartProps {
  data?: PropertySalesChartItem[];
  loading?: boolean;
}

export function RevenueChart({ data = [], loading }: RevenueChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Property Sales by Type
      </h3>

      {!loading && data.length === 0 ? (
        <div className="text-sm text-gray-500">No data.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="type"
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
              formatter={(value) => (value as number).toLocaleString("vi-VN")}
            />
            <Bar dataKey="available" fill="#1A73E8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sold" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
