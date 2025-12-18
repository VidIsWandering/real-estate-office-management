"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import {
  NewEventForm,
  EventFormData,
} from "@/components/calendar/NewEventForm";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Calendar() {
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

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
            onDayClick={(date) => setIsNewEventDialogOpen(true)}
            onAddEventForDate={handleAddEventForDate}
          />
        </div>

        {/* Upcoming Events - Right side */}
        <div>
          <UpcomingEvents />
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
