"use client";

import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";

export default function CalendarPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Calendar Area */}
      <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
        <CalendarHeader />
        <CalendarGrid />
      </div>

      {/* RIGHT EVENTS SIDEBAR - Hidden on mobile, visible on lg+ */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-20">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
