import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  description,
}: KPICardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>

      {/* Footer with Trend */}
      {(trend || description) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {trend && (
            <div className="flex items-center gap-1">
              {trend.positive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-600">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
