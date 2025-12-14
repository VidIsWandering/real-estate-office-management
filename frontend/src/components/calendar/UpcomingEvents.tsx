import { EventCard } from "./EventCard"

const upcoming = [
    {
        type: "Viewing",
        title: "Property Viewing",
        address: "Oak Street",
        time: "Today • 11 AM",
        person: "John Wilson",
        color: "blue",
    },
    {
        type: "Meeting",
        title: "Client Meeting",
        address: "Strategy Review",
        time: "Today • 3 PM",
        person: "Sarah Martinez",
        color: "green",
    },
    {
        type: "Inspection",
        title: "Home Inspection",
        address: "Maple Avenue",
        time: "Tomorrow • 9 AM",
        person: "",
        color: "yellow",
    },
] as const

export function UpcomingEvents() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>

            {upcoming.map((ev, i) => (
                <EventCard key={i} event={ev} />
            ))}
        </div>
    )
}
