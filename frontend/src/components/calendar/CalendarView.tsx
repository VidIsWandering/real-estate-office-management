import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useState } from "react";
import { ViewEventsModal } from "./ViewEventsModal";
import { AllEventsPanel } from "./AllEventsPanel";
import { DateContextMenu } from "./DateContextMenu";

export interface CalendarEvent {
  id: string;
  title: string;
  type: "Viewing" | "Showing" | "Inspection" | "Meeting" | "Closing";
  date: string;
  time: string;
  property?: string;
  client?: string;
  agent?: string;
  location?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
  onAddEventForDate?: (date: string) => void;
}

export function CalendarView({
  events,
  currentDate,
  onCurrentDateChange,
  onAddEventForDate,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isViewEventsModalOpen, setIsViewEventsModalOpen] = useState(false);
  const [isAllEventsPanelOpen, setIsAllEventsPanelOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    date: string | null;
  }>({ isOpen: false, x: 0, y: 0, date: null });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    onCurrentDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    onCurrentDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }
    return dayNumber;
  });

  const getEventsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  const getEventColor = (type: string) => {
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

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setIsViewEventsModalOpen(true);
  };

  const handleDayRightClick = (e: React.MouseEvent, day: number | null) => {
    e.preventDefault();
    if (!day) return;

    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      date: dateStr,
    });
  };

  const handleAddEventFromContext = () => {
    if (contextMenu.date && onAddEventForDate) {
      onAddEventForDate(contextMenu.date);
    }
  };

  const handleViewEventsFromContext = () => {
    if (contextMenu.date) {
      setSelectedDate(contextMenu.date);
      setIsViewEventsModalOpen(true);
    }
  };

  const handleViewMoreClick = (day: number | null) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setIsViewEventsModalOpen(true);
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    return events.filter((event) => event.date === selectedDate);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsAllEventsPanelOpen(true)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              title="View all events"
            >
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">
                All Events
              </span>
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                onContextMenu={(e) => handleDayRightClick(e, day)}
                className={`min-h-24 p-2 rounded-lg border transition-colors ${
                  day
                    ? "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded font-medium truncate ${getEventColor(
                            event.type,
                          )}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMoreClick(day);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 px-2 font-medium transition-colors"
                        >
                          +{dayEvents.length - 2} more
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* View Events Modal */}
      {selectedDate && (
        <ViewEventsModal
          isOpen={isViewEventsModalOpen}
          onClose={() => setIsViewEventsModalOpen(false)}
          events={getSelectedDateEvents()}
          selectedDate={selectedDate}
        />
      )}

      {/* All Events Panel */}
      <AllEventsPanel
        isOpen={isAllEventsPanelOpen}
        onClose={() => setIsAllEventsPanelOpen(false)}
        events={events}
      />

      {/* Date Context Menu */}
      <DateContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        onAddEvent={handleAddEventFromContext}
        onViewEvents={handleViewEventsFromContext}
      />
    </>
  );
}
