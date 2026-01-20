"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import {
  NewEventForm,
  EventFormData,
} from "@/components/calendar/NewEventForm";
import type { UpcomingEvent } from "@/components/calendar/UpcomingEvents";
import {
  createAppointment,
  getAppointmentsList,
  Appointment,
  updateAppointment,
  updateAppointmentStatus,
} from "@/lib/api/appointments";
import { getClientOptions } from "@/lib/api/clients";
import { getRealEstatesList } from "@/lib/api/real-estates";
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

function formatTimeHHMM(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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
    appointment: {
      id: appointment.id,
      real_estate_id: appointment.real_estate_id,
      client_id: appointment.client_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      location: appointment.location,
      note: appointment.note,
      status: appointment.status,
    },
  };
}

function parseAppointmentNote(
  note: string | null | undefined,
): { type: EventFormData["type"]; title: string } | null {
  if (!note) return null;
  const trimmed = note.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^(Viewing|Showing|Inspection|Meeting|Closing):\s*(.+)$/i,
  );
  if (!match) return null;

  const rawType = match[1].toLowerCase();
  const title = match[2]?.trim() || "";
  const typeMap: Record<string, EventFormData["type"]> = {
    viewing: "Viewing",
    showing: "Showing",
    inspection: "Inspection",
    meeting: "Meeting",
    closing: "Closing",
  };

  const type = typeMap[rawType];
  if (!type) return null;
  if (!title) return null;

  return { type, title };
}

export default function Calendar() {
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<
    import("@/components/calendar/CalendarView").CalendarEvent | null
  >(null);

  const [propertyOptions, setPropertyOptions] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [clientOptions, setClientOptions] = useState<
    Array<{ id: number; label: string }>
  >([]);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [appointmentsForMonth, setAppointmentsForMonth] = useState<
    Appointment[]
  >([]);
  const [appointmentsUpcoming, setAppointmentsUpcoming] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [clientsRes, realEstatesRes] = await Promise.all([
          getClientOptions({ page: 1, limit: 100 }),
          getRealEstatesList({ page: 1, limit: 100 }),
        ]);

        if (cancelled) return;

        setClientOptions(
          clientsRes.data.map((c) => ({
            id: c.id,
            label: c.full_name,
          })),
        );
        setPropertyOptions(
          realEstatesRes.data.map((re) => ({
            id: re.id,
            label: re.title,
          })),
        );
      } catch (err) {
        console.error("Failed to load appointment form options", err);
        if (!cancelled) {
          setClientOptions([]);
          setPropertyOptions([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const upcomingEvents = useMemo<UpcomingEvent[]>(() => {
    const now = new Date();
    const items = appointmentsUpcoming
      .map((a) => {
        const start = new Date(a.start_time);
        if (Number.isNaN(start.getTime())) return null;
        if (start.getTime() < now.getTime()) return null;

        const location = a.location ?? undefined;
        const inferredType: UpcomingEvent["type"] = location
          ?.toLowerCase()
          .includes("office")
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

  const refreshAppointments = async () => {
    const monthFrom = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const monthTo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const upcomingFrom = startOfDayLocal(new Date());
    const upcomingToDay = addDaysLocal(upcomingFrom, 14);
    const upcomingTo = new Date(
      upcomingToDay.getFullYear(),
      upcomingToDay.getMonth(),
      upcomingToDay.getDate(),
      23,
      59,
      59,
      999,
    );

    const [monthRes, upcomingRes] = await Promise.all([
      getAppointmentsList({
        page: 1,
        limit: 100,
        from_time: monthFrom.toISOString(),
        to_time: monthTo.toISOString(),
      }),
      getAppointmentsList({
        page: 1,
        limit: 100,
        from_time: upcomingFrom.toISOString(),
        to_time: upcomingTo.toISOString(),
      }),
    ]);

    setAppointmentsForMonth(monthRes.data);
    setAppointmentsUpcoming(upcomingRes.data);
  };

  const handleUpdateAppointmentStatus = async (
    event: import("@/components/calendar/CalendarView").CalendarEvent,
    status: "created" | "confirmed" | "completed" | "cancelled",
  ) => {
    try {
      const apptId = event.appointment?.id;
      const current = event.appointment?.status;
      if (!apptId || !current) throw new Error("Missing appointment info");

      // Backend supports:
      // CREATED -> CONFIRMED
      // CREATED/CONFIRMED -> CANCELLED
      // CONFIRMED -> COMPLETED
      // We'll rely on backend validation, but still show a friendly confirm.
      const ok = confirm(
        `Change appointment status from ${current.toUpperCase()} to ${status.toUpperCase()}?`,
      );
      if (!ok) return;

      let result_note: string | undefined = undefined;
      if (status === "cancelled") {
        const reason = prompt("Cancellation note (optional):", "");
        if (reason !== null && reason.trim()) result_note = reason.trim();
      }
      if (status === "completed") {
        const note = prompt("Result note (optional):", "");
        if (note !== null && note.trim()) result_note = note.trim();
      }

      await updateAppointmentStatus(apptId, { status, result_note });
      await refreshAppointments();
    } catch (err) {
      console.error("Failed to update appointment status", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update appointment status",
      );
    }
  };

  const handleAddEvent = async (data: EventFormData) => {
    try {
      const start = new Date(`${data.date}T${data.start_time}`);
      const end = new Date(`${data.date}T${data.end_time}`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("Invalid start/end time");
      }

      await createAppointment({
        real_estate_id: Number(data.real_estate_id),
        client_id: Number(data.client_id),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        location: data.location?.trim() ? data.location.trim() : undefined,
        note: `${data.type}: ${data.title}`,
      });

      await refreshAppointments();

      setIsNewEventDialogOpen(false);
      setSelectedDate(undefined);
    } catch (err) {
      console.error("Failed to create appointment", err);
      alert(
        err instanceof Error ? err.message : "Failed to create appointment",
      );
    }
  };

  const editInitialValues = useMemo<Partial<EventFormData> | undefined>(() => {
    const appt = editingEvent?.appointment;
    if (!appt) return undefined;

    const start = new Date(appt.start_time);
    const end = new Date(appt.end_time);

    const parsed = parseAppointmentNote(appt.note);
    const type = parsed?.type ?? editingEvent?.type ?? "Viewing";
    const title = parsed?.title ?? editingEvent?.title ?? "";

    return {
      title,
      type,
      date: toDateKeyLocal(start),
      start_time: formatTimeHHMM(start),
      end_time: formatTimeHHMM(end),
      real_estate_id: String(appt.real_estate_id),
      client_id: String(appt.client_id),
      location: appt.location ?? "",
    };
  }, [editingEvent]);

  const handleEditEvent = (
    event: import("@/components/calendar/CalendarView").CalendarEvent,
  ) => {
    if (!event.appointment?.id) {
      alert("This event cannot be edited (missing appointment id).");
      return;
    }
    setEditingEvent(event);
    setIsEditEventDialogOpen(true);
  };

  const handleUpdateEvent = async (data: EventFormData) => {
    try {
      const apptId = editingEvent?.appointment?.id;
      if (!apptId) throw new Error("Missing appointment id");

      const start = new Date(`${data.date}T${data.start_time}`);
      const end = new Date(`${data.date}T${data.end_time}`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("Invalid start/end time");
      }

      await updateAppointment(apptId, {
        real_estate_id: Number(data.real_estate_id),
        client_id: Number(data.client_id),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        location: data.location?.trim() ? data.location.trim() : "",
        note: `${data.type}: ${data.title}`,
      });

      await refreshAppointments();

      setIsEditEventDialogOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Failed to update appointment", err);
      alert(
        err instanceof Error ? err.message : "Failed to update appointment",
      );
    }
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
            onEditEvent={handleEditEvent}
            onUpdateStatus={handleUpdateAppointmentStatus}
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
        propertyOptions={propertyOptions}
        clientOptions={clientOptions}
      />

      <NewEventForm
        isOpen={isEditEventDialogOpen}
        onClose={() => {
          setIsEditEventDialogOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleUpdateEvent}
        initialValues={editInitialValues}
        dialogTitle="Edit Appointment"
        submitLabel="Save Changes"
        propertyOptions={propertyOptions}
        clientOptions={clientOptions}
      />
    </>
  );
}
