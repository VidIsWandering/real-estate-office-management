"use client"

import { CalendarHeader } from "@/components/calendar/CalendarHeader"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents"

export default function CalendarPage() {
    return (
        <div className="space-y-6 flex gap-6">

            <div className="flex-1 space-y-6">
                <CalendarHeader />
                <CalendarGrid />
            </div>

            {/* RIGHT EVENTS SIDEBAR */}
            <div className="w-80">
                <UpcomingEvents />
            </div>
        </div>
    )
}
