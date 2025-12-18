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
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  type: "Viewing" | "Showing" | "Inspection" | "Meeting" | "Closing";
  property?: string;
  client?: string;
  agent?: string;
  location?: string;
}

const propertyOptions = [
  "123 Oak Street",
  "456 Maple Avenue",
  "789 Pine Road",
  "321 Elm Street",
  "654 Cedar Lane",
  "987 Birch Boulevard",
];

const clientOptions = [
  "John Wilson",
  "Sarah Martinez",
  "Michael Chen",
  "Lisa Anderson",
  "David Thompson",
  "Emma Johnson",
];

const agentOptions = [
  "Alice Chen",
  "Bob Smith",
  "Carol Davis",
  "David Lee",
  "Emma Wilson",
  "Frank Brown",
];

export function NewEventForm({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
}: NewEventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    date: initialDate || "",
    time: "",
    type: "Viewing",
    property: "",
    client: "",
    agent: "",
    location: "",
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  // Update date when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        date: initialDate,
      }));
    }
  }, [initialDate]);

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
    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: "",
        date: initialDate || "",
        time: "",
        type: "Viewing",
        property: "",
        client: "",
        agent: "",
        location: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* Event Title */}
          <div>
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
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
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
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? "border-red-500" : ""}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Event Type */}
          <div>
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
          <div>
            <Label htmlFor="property">Property</Label>
            <Select
              value={formData.property}
              onValueChange={(value) => handleSelectChange("property", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {propertyOptions.map((prop) => (
                  <SelectItem key={prop} value={prop}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Selection */}
          <div>
            <Label htmlFor="client">Client</Label>
            <Select
              value={formData.client}
              onValueChange={(value) => handleSelectChange("client", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agent Selection */}
          <div>
            <Label htmlFor="agent">Agent</Label>
            <Select
              value={formData.agent}
              onValueChange={(value) => handleSelectChange("agent", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agentOptions.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
