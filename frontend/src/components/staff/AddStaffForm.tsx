import { useState } from "react";
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
import type { StaffRole, StaffStatus } from "@/lib/api";
import { CreateStaffFormData } from "./types";

interface AddStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffFormData) => Promise<void>;
}

const roles: Array<{ value: StaffRole; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "agent", label: "Agent" },
  { value: "legal_officer", label: "Legal officer" },
  { value: "accountant", label: "Accountant" },
];

const areas = [
  "Downtown District",
  "Riverside District",
  "North Valley",
  "Westside Area",
  "Eastside Zone",
  "Suburban Region",
  "Central Hub",
];

export function AddStaffForm({ isOpen, onClose, onSubmit }: AddStaffFormProps) {
  const [formData, setFormData] = useState<CreateStaffFormData>({
    full_name: "",
    username: "",
    password: "",
    email: "",
    phone_number: "",
    address: "",
    assigned_area: "",
    role: "agent",
    status: "working",
  });

  const [errors, setErrors] = useState<Partial<CreateStaffFormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof CreateStaffFormData]) {
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

    if (name === "role") {
      setSubmitError(null);
      if (value !== "agent") {
        setFormData((prev) => ({
          ...prev,
          assigned_area: "",
        }));
        if (errors.assigned_area) {
          setErrors((prev) => ({
            ...prev,
            assigned_area: "",
          }));
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateStaffFormData> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (formData.role === "agent" && !formData.assigned_area.trim()) {
      newErrors.assigned_area = "Assigned area is required for Agent";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setSubmitError(null);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setFormData({
          full_name: "",
          username: "",
          password: "",
          email: "",
          phone_number: "",
          address: "",
          assigned_area: "",
          role: "agent",
          status: "working",
        });
        setErrors({});
        onClose();
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to create staff",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto space-y-6"
        >
          {submitError && (
            <div className="text-sm text-red-600">{submitError}</div>
          )}
          {/* Staff Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name *</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className={errors.full_name ? "border-red-500" : ""}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., john.doe"
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="e.g., 5551234567"
              className={errors.phone_number ? "border-red-500" : ""}
            />
            {errors.phone_number && (
              <p className="text-xs text-red-500">{errors.phone_number}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                handleSelectChange("role", value as StaffRole)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Area */}
          {formData.role === "agent" && (
            <div className="space-y-2">
              <Label htmlFor="assigned_area">Assigned Area *</Label>
              <Select
                value={formData.assigned_area}
                onValueChange={(value) =>
                  handleSelectChange("assigned_area", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigned_area && (
                <p className="text-xs text-red-500">{errors.assigned_area}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleSelectChange("status", value as StaffStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="off_duty">Off duty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
