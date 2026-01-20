import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent } from "./CalendarView";

interface ViewEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedDate: string;
  onEditEvent?: (event: CalendarEvent) => void;
  onUpdateStatus?: (
    event: CalendarEvent,
    status: "created" | "confirmed" | "completed" | "cancelled",
  ) => void;
}

export function ViewEventsModal({
  isOpen,
  onClose,
  events,
  selectedDate,
  onEditEvent,
  onUpdateStatus,
}: ViewEventsModalProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case "Viewing":
        return "bg-blue-50 border-blue-200";
      case "Showing":
        return "bg-purple-50 border-purple-200";
      case "Inspection":
        return "bg-amber-50 border-amber-200";
      case "Meeting":
        return "bg-green-50 border-green-200";
      case "Closing":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getEventBadgeColor = (type: string) => {
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
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return "bg-gray-100 text-gray-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case "created":
        return "CREATED";
      case "confirmed":
        return "CONFIRMED";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Events on {formatDate(selectedDate)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No events scheduled for this day</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`p-4 border rounded-lg ${getEventColor(event.type)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getEventBadgeColor(
                          event.type,
                        )}`}
                      >
                        {event.type}
                      </span>
                      {event.appointment?.status ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(
                            event.appointment.status,
                          )}`}
                        >
                          {formatStatusLabel(event.appointment.status)}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold text-gray-900">
                        {event.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-600">
                      {event.property && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Property:</span>
                          <span>{event.property}</span>
                        </div>
                      )}
                      {event.client && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Client:</span>
                          <span>{event.client}</span>
                        </div>
                      )}
                      {event.agent && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Agent:</span>
                          <span>{event.agent}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Location:</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {onUpdateStatus && event.appointment?.status ? (
                      <>
                        {event.appointment.status === "created" ? (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(event, "confirmed")}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Confirm
                          </button>
                        ) : null}

                        {event.appointment.status === "confirmed" ? (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(event, "completed")}
                            className="text-sm font-medium text-green-600 hover:text-green-700"
                          >
                            Complete
                          </button>
                        ) : null}

                        {event.appointment.status === "created" ||
                        event.appointment.status === "confirmed" ? (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(event, "cancelled")}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </>
                    ) : null}

                    {onEditEvent && event.appointment?.id ? (
                      <button
                        type="button"
                        onClick={() => onEditEvent(event)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
