import { User, MessageSquare, FileText, Eye, Calendar } from "lucide-react";

interface Activity {
  id: string;
  type: "client" | "message" | "document" | "viewing" | "meeting";
  description: string;
  user: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "client",
    description: "New client registered",
    user: "Sarah Johnson",
    time: "1 hour ago",
  },
  {
    id: "2",
    type: "viewing",
    description: "Property viewing scheduled",
    user: "Michael Brown",
    time: "3 hours ago",
  },
  {
    id: "3",
    type: "message",
    description: "New message from client",
    user: "Jennifer Davis",
    time: "5 hours ago",
  },
  {
    id: "4",
    type: "document",
    description: "Contract signed",
    user: "Robert Wilson",
    time: "1 day ago",
  },
  {
    id: "5",
    type: "meeting",
    description: "Team meeting completed",
    user: "Team Meeting",
    time: "2 days ago",
  },
];

function getActivityIcon(type: Activity["type"]) {
  const icons = {
    client: <User className="w-4 h-4" />,
    message: <MessageSquare className="w-4 h-4" />,
    document: <FileText className="w-4 h-4" />,
    viewing: <Eye className="w-4 h-4" />,
    meeting: <Calendar className="w-4 h-4" />,
  };
  return icons[type];
}

function getActivityColor(type: Activity["type"]) {
  const colors = {
    client: "bg-green-50 text-green-600",
    message: "bg-blue-50 text-blue-600",
    document: "bg-purple-50 text-purple-600",
    viewing: "bg-orange-50 text-orange-600",
    meeting: "bg-pink-50 text-pink-600",
  };
  return colors[type];
}

export function RecentActivities() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Client Activities
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-600 mt-1">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap ml-2">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Activities →
        </button>
      </div>
    </div>
  );
}
