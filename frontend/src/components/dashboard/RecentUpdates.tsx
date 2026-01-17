import { ArrowRight, Home, CheckCircle2, AlertCircle } from "lucide-react";

interface Update {
  id: string;
  property: string;
  status: "updated" | "sold" | "pending";
  date: string;
  price: string;
}

const updates: Update[] = [
  {
    id: "1",
    property: "Luxury Penthouse - Downtown",
    status: "sold",
    date: "2 hours ago",
    price: "$950,000",
  },
  {
    id: "2",
    property: "Suburban Family Home",
    status: "updated",
    date: "5 hours ago",
    price: "$425,000",
  },
  {
    id: "3",
    property: "Commercial Office Space",
    status: "pending",
    date: "1 day ago",
    price: "$1,200,000",
  },
  {
    id: "4",
    property: "Beachfront Condo",
    status: "updated",
    date: "2 days ago",
    price: "$650,000",
  },
];

function getStatusIcon(status: Update["status"]) {
  switch (status) {
    case "sold":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "pending":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    default:
      return <Home className="w-5 h-5 text-blue-600" />;
  }
}

function getStatusLabel(status: Update["status"]) {
  const labels = {
    sold: "Sold",
    updated: "Updated",
    pending: "Pending",
  };
  return labels[status];
}

function getStatusColor(status: Update["status"]) {
  const colors = {
    sold: "bg-green-50 text-green-700",
    updated: "bg-blue-50 text-blue-700",
    pending: "bg-yellow-50 text-yellow-700",
  };
  return colors[status];
}

export function RecentUpdates() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Property Updates
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(update.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {update.property}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{update.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(update.status)}`}
                >
                  {getStatusLabel(update.status)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-2">
              {update.price}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Updates →
        </button>
      </div>
    </div>
  );
}
