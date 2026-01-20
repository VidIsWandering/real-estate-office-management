"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import {
  NewEventForm,
  EventFormData,
} from "@/components/calendar/NewEventForm";
import { getAppointmentsList, Appointment } from "@/lib/api/appointments";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function toDateKeyLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeAmPm(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function startOfDayLocal(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

function addDaysLocal(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function labelRelativeDate(date: Date): string {
  const today = startOfDayLocal(new Date());
  const target = startOfDayLocal(date);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mapAppointmentToCalendarEvent(
  appointment: Appointment,
): import("@/components/calendar/CalendarView").CalendarEvent | null {
  const start = new Date(appointment.start_time);
  if (Number.isNaN(start.getTime())) return null;

  const location = appointment.location ?? undefined;
  const inferredType = location?.toLowerCase().includes("office")
    ? "Meeting"
    : "Viewing";

  return {
    id: String(appointment.id),
    title: appointment.note?.trim()
      ? appointment.note
      : `Appointment #${appointment.id}`,
    type: inferredType,
    date: toDateKeyLocal(start),
    time: formatTimeAmPm(start),
    property: `Real Estate #${appointment.real_estate_id}`,
    client: `Client #${appointment.client_id}`,
    location,
  };
}

export default function Calendar() {
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [appointmentsForMonth, setAppointmentsForMonth] = useState<
    Appointment[]
  >([]);
  const [appointmentsUpcoming, setAppointmentsUpcoming] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const to = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    (async () => {
      try {
        const res = await getAppointmentsList({
          page: 1,
          limit: 100,
          from_time: from.toISOString(),
          to_time: to.toISOString(),
        });
        if (!cancelled) setAppointmentsForMonth(res.data);
      } catch (err) {
        console.error("Failed to load appointments for month", err);
        if (!cancelled) setAppointmentsForMonth([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentDate]);

  useEffect(() => {
    let cancelled = false;

    const from = startOfDayLocal(new Date());
    const toDay = addDaysLocal(from, 14);
    const to = new Date(
      toDay.getFullYear(),
      toDay.getMonth(),
      toDay.getDate(),
      23,
      59,
      59,
      999,
    );

    (async () => {
      try {
        const res = await getAppointmentsList({
          page: 1,
          limit: 100,
          from_time: from.toISOString(),
          to_time: to.toISOString(),
        });
        if (!cancelled) setAppointmentsUpcoming(res.data);
      } catch (err) {
        console.error("Failed to load upcoming appointments", err);
        if (!cancelled) setAppointmentsUpcoming([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const calendarEvents = useMemo(() => {
    return appointmentsForMonth
      .map(mapAppointmentToCalendarEvent)
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [appointmentsForMonth]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const items = appointmentsUpcoming
      .map((a) => {
        const start = new Date(a.start_time);
        if (Number.isNaN(start.getTime())) return null;
        if (start.getTime() < now.getTime()) return null;

        const location = a.location ?? undefined;
        const inferredType = location?.toLowerCase().includes("office")
          ? "Meeting"
          : "Viewing";

        return {
          startMs: start.getTime(),
          event: {
            id: String(a.id),
            title: a.note?.trim() ? a.note : `Appointment #${a.id}`,
            type: inferredType,
            date: labelRelativeDate(start),
            time: formatTimeAmPm(start),
            property: `Real Estate #${a.real_estate_id}`,
            client: `Client #${a.client_id}`,
            location,
          },
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.startMs - b.startMs);

    return items.slice(0, 10).map((x) => x.event);
  }, [appointmentsUpcoming]);

  const handleAddEvent = (data: EventFormData) => {
    console.log("New event added:", data);
    setIsNewEventDialogOpen(false);
    setSelectedDate(undefined);
  };

  const handleAddEventForDate = (date: string) => {
    setSelectedDate(date);
    setIsNewEventDialogOpen(true);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Calendar & Scheduling
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage appointments, viewings, and meetings.
          </p>
        </div>
        <button
          onClick={() => setIsNewEventDialogOpen(true)}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar - Left side */}
        <div className="lg:col-span-2">
          <CalendarView
            events={calendarEvents}
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            onAddEventForDate={handleAddEventForDate}
          />
        </div>

        {/* Upcoming Events - Right side */}
        <div>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>

      {/* New Event Form */}
      <NewEventForm
        isOpen={isNewEventDialogOpen}
        onClose={() => {
          setIsNewEventDialogOpen(false);
          setSelectedDate(undefined);
        }}
        onSubmit={handleAddEvent}
        initialDate={selectedDate}
      />
    </>
  );
}
