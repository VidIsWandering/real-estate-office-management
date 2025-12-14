"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarGrid() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

            {/* MONTH HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">January</h2>

                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    <button className="p-2 hover:bg-gray-100 rounded-md">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-4">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* CALENDAR CELLS */}
            <div className="grid grid-cols-7 gap-3">
                <CalendarCell events={["P", "H", "Cl", "P", "Mark"]} />
                <CalendarCell empty />
                <CalendarCell empty />
                <CalendarCell empty />
                <CalendarCell empty />
                <CalendarCell empty />
                <CalendarCell empty />

                {/* More empty rows */}
                {Array.from({ length: 35 }).map((_, i) => (
                    <CalendarCell key={i} empty />
                ))}
            </div>
        </div>
    )
}

// --- CELL COMPONENT ---
function CalendarCell({
                          events = [],
                          empty = false,
                      }: {
    events?: string[]
    empty?: boolean
}) {
    return (
        <div className="border border-gray-200 rounded-xl h-24 p-1 relative bg-white">
            {!empty &&
                <div className="flex flex-col gap-1">
                    {events.includes("P") && <EventChip label="P" color="bg-blue-100 text-blue-700" />}
                    {events.includes("H") && <EventChip label="H" color="bg-yellow-100 text-yellow-700" />}
                    {events.includes("Cl") && <EventChip label="Cl" color="bg-purple-100 text-purple-700" />}
                    {events.includes("Mark") && <EventChip label="Mark" color="bg-green-100 text-green-700" />}
                </div>
            }
        </div>
    )
}

// --- EVENT CHIP ---
function EventChip({ label, color }: { label: string; color: string }) {
    return (
        <div className={`px-2 py-0.5 text-xs rounded-md font-medium w-fit ${color}`}>
            {label}
        </div>
    )
}
