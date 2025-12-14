import { Award, TrendingUp, Target, BarChart3 } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  metric: string;
  value: number;
  trend: number; 
}

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Emma Wilson", metric: "Sales", value: 31, trend: 15 },
  { rank: 2, name: "Alice Chen", metric: "Sales", value: 28, trend: 12 },
  { rank: 3, name: "Carol Davis", metric: "Sales", value: 25, trend: 8 },
  { rank: 4, name: "Bob Smith", metric: "Sales", value: 22, trend: -3 },
  { rank: 5, name: "David Lee", metric: "Sales", value: 19, trend: 5 },
];

interface MonthlyKPI {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

const monthlyKPIs: MonthlyKPI[] = [
  { label: "Total Sales", value: 125, icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Active Deals", value: 87, icon: <Target className="w-4 h-4" /> },
  { label: "Avg. Price", value: "$625K", icon: <BarChart3 className="w-4 h-4" /> },
];

export function AgentLeaderboard() {
  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {entry.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {entry.name}
                    </p>
                    <p className="text-xs text-gray-600">{entry.metric}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {entry.value}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      entry.trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {entry.trend > 0 ? "+" : ""}
                    {entry.trend}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly KPIs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly KPI Highlights
        </h3>
        <div className="space-y-3">
          {monthlyKPIs.map((kpi, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded">
                  {kpi.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {kpi.label}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}