import { Clock, MapPin, Users } from "lucide-react";

export interface UpcomingEvent {
  id: string;
  title: string;
  type: "Viewing" | "Showing" | "Inspection" | "Meeting" | "Closing";
  date: string;
  time: string;
  property?: string;
  client?: string;
  location?: string;
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "EVT001",
    title: "Property Viewing - 123 Oak Street",
    type: "Viewing",
    date: "Today",
    time: "10:00 AM",
    property: "123 Oak Street",
    client: "John Wilson",
    location: "123 Oak Street, Downtown",
  },
  {
    id: "EVT002",
    title: "Client Meeting - Strategy Review",
    type: "Meeting",
    date: "Today",
    time: "2:30 PM",
    client: "Sarah Martinez",
    location: "Office",
  },
  {
    id: "EVT003",
    title: "Home Inspection - 456 Maple Avenue",
    type: "Inspection",
    date: "Tomorrow",
    time: "9:00 AM",
    property: "456 Maple Avenue",
    location: "456 Maple Avenue",
  },
  {
    id: "EVT004",
    title: "Property Showing - 789 Pine Road",
    type: "Showing",
    date: "Tomorrow",
    time: "3:00 PM",
    property: "789 Pine Road",
    client: "Michael Chen",
    location: "789 Pine Road",
  },
  {
    id: "EVT005",
    title: "Closing Meeting",
    type: "Closing",
    date: "Jan 10",
    time: "11:00 AM",
    property: "321 Elm Street",
    client: "Lisa Anderson",
    location: "Law Office",
  },
];

function getEventColor(type: string) {
  switch (type) {
    case "Viewing":
      return "border-l-4 border-l-blue-600 bg-blue-50";
    case "Showing":
      return "border-l-4 border-l-purple-600 bg-purple-50";
    case "Inspection":
      return "border-l-4 border-l-amber-600 bg-amber-50";
    case "Meeting":
      return "border-l-4 border-l-green-600 bg-green-50";
    case "Closing":
      return "border-l-4 border-l-red-600 bg-red-50";
    default:
      return "border-l-4 border-l-gray-600 bg-gray-50";
  }
}

function getEventBadgeColor(type: string) {
  switch (type) {
    case "Viewing":
      return "bg-blue-100 text-blue-700";
    case "Showing":
      return "bg-purple-100 text-purple-700";
    case "Inspection":
      return "bg-amber-100 text-amber-700";
    case "Meeting":
      return "bg-green-100 text-green-700";
    case "Closing":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function UpcomingEvents() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Events
      </h3>

      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg transition-colors cursor-pointer hover:shadow-md ${getEventColor(
              event.type,
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {event.title}
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getEventBadgeColor(
                  event.type,
                )}`}
              >
                {event.type}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span>
                  {event.date} at {event.time}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}

              {event.client && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{event.client}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* <button className="w-full mt-6 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        View All Events
      </button> */}
    </div>
  );
}
