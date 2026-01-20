import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialDate?: string;
  initialValues?: Partial<EventFormData>;
  dialogTitle?: string;
  submitLabel?: string;
  propertyOptions: Array<{ id: number; label: string }>;
  clientOptions: Array<{ id: number; label: string }>;
}

export interface EventFormData {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: "Viewing" | "Showing" | "Inspection" | "Meeting" | "Closing";
  real_estate_id: string;
  client_id: string;
  location?: string;
}

export function NewEventForm({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  initialValues,
  dialogTitle,
  submitLabel,
  propertyOptions,
  clientOptions,
}: NewEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(() => ({
    title: "",
    date: initialDate || "",
    start_time: "",
    end_time: "",
    type: "Viewing",
    real_estate_id: "",
    client_id: "",
    location: "",
  }));

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  // Initialize / re-initialize form when opened (supports edit mode via initialValues)
  useEffect(() => {
    if (!isOpen) return;

    const date = initialValues?.date ?? initialDate ?? "";

    setFormData({
      title: "",
      start_time: "",
      end_time: "",
      type: "Viewing",
      real_estate_id: "",
      client_id: "",
      location: "",
      ...initialValues,
      date,
    });
    setErrors({});
  }, [isOpen, initialDate, initialValues]);

  // Set a sensible default duration when date changes and times are empty
  useEffect(() => {
    setFormData((prev) => {
      if (!prev.date) return prev;
      if (prev.start_time || prev.end_time) return prev;
      return {
        ...prev,
        start_time: "09:00",
        end_time: "10:00",
      };
    });
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }
    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (formData.start_time && formData.end_time) {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(`${formData.date}T${formData.end_time}`);
      if (Number.isFinite(start.getTime()) && Number.isFinite(end.getTime())) {
        if (end.getTime() <= start.getTime()) {
          newErrors.end_time = "End time must be after start time";
        }
      }
    }

    if (!formData.real_estate_id) {
      newErrors.real_estate_id = "Property is required";
    }
    if (!formData.client_id) {
      newErrors.client_id = "Client is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  useEffect(() => {
    if (isOpen) return;
    setFormData({
      title: "",
      date: initialDate || "",
      start_time: "",
      end_time: "",
      type: "Viewing",
      real_estate_id: "",
      client_id: "",
      location: "",
    });
    setErrors({});
  }, [isOpen, initialDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle ?? "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form
          id="new-event-form"
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Property Viewing"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                className={errors.start_time ? "border-red-500" : ""}
              />
              {errors.start_time && (
                <p className="text-red-500 text-xs">{errors.start_time}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End Time *</Label>
            <Input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              className={errors.end_time ? "border-red-500" : ""}
            />
            {errors.end_time && (
              <p className="text-red-500 text-xs">{errors.end_time}</p>
            )}
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleSelectChange("type", value as EventFormData["type"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Viewing">Viewing</SelectItem>
                <SelectItem value="Showing">Showing</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Selection */}
          <div className="space-y-2">
            <Label htmlFor="real_estate_id">Property *</Label>
            <Select
              value={formData.real_estate_id}
              onValueChange={(value) =>
                handleSelectChange("real_estate_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {propertyOptions.map((prop) => (
                  <SelectItem key={prop.id} value={String(prop.id)}>
                    {prop.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.real_estate_id && (
              <p className="text-red-500 text-xs">{errors.real_estate_id}</p>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => handleSelectChange("client_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-red-500 text-xs">{errors.client_id}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., 123 Oak Street, Downtown"
            />
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-event-form">
            {submitLabel ?? "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
