type CalendarEvent = {
    type: string
    title: string
    address: string
    time: string
    person?: string
    color: "blue" | "green" | "yellow" | "purple" | "red"
}

interface EventCardProps {
    event: CalendarEvent
}

export function EventCard({ event }: EventCardProps) {
    const colorMap: Record<CalendarEvent["color"], string> = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
            {/* TYPE BADGE */}
            <span
                className={`px-2 py-0.5 text-xs rounded-md font-medium ${colorMap[event.color]}`}
            >
        {event.type}
      </span>

            {/* TITLE */}
            <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>

            {/* ADDRESS */}
            <div className="text-gray-600 text-sm">{event.address}</div>

            {/* TIME */}
            <div className="text-gray-500 text-xs">{event.time}</div>

            {/* PERSON */}
            {event.person && (
                <div className="text-gray-700 text-sm font-medium">{event.person}</div>
            )}
        </div>
    )
}
