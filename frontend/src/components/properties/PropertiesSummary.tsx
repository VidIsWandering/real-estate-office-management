import { Building2, Home, Key, Sparkles } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const summaryCards: SummaryCard[] = [
  {
    title: "Total Properties",
    value: 348,
    icon: <Building2 className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Properties for Sale",
    value: 156,
    icon: <Home className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Properties for Rent",
    value: 192,
    icon: <Key className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Recently Added",
    value: 23,
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export function PropertySummary() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
      <div className="space-y-3">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h4>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-1 flex-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
