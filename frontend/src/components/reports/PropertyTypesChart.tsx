"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Apartments", value: 45 },
  { name: "Houses", value: 30 },
  { name: "Commercial", value: 15 },
  { name: "Land", value: 10 },
];

const COLORS = ["#1A73E8", "#34A853", "#FBBC04", "#EA4335"];

export function PropertyTypesChart() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Property Types Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#111827" }}
            formatter={(value) => `${value}%`}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
            verticalAlign="bottom"
            height={36}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ value }) => `${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
