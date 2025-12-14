"use client"

import { Plus } from "lucide-react"

export function CalendarHeader() {
    return (
        <div className="flex justify-between items-start">

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
                <p className="text-gray-500 mt-1 text-sm max-w-xl leading-relaxed">
                    Schedule and manage appointments, viewings, and meetings.
                </p>
            </div>

            {/* NEW EVENT BUTTON */}
            <button className="flex items-center gap-2 bg-[#1A73E8] text-white px-5 h-11 rounded-xl text-sm font-medium shadow">
                <div className="bg-white/20 p-1.5 rounded-full">
                    <Plus className="w-4 h-4" />
                </div>
                New Event
            </button>
        </div>
    )
}
