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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ClientCategory,
  ClientFormData,
  ClientItem,
} from "./types";

interface EditClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  initialData: ClientItem;
}

export function EditClientForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    address: initialData.address,
    clientType: initialData.clientType,
    referralSource: initialData.referralSource ?? "",
    requirement: initialData.requirement ?? "",
  });

  const [errors, setErrors] = useState<Partial<ClientFormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ClientFormData]) {
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
    const newErrors: Partial<ClientFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Client name is required";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update client",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client Information</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {submitError && (
            <div className="text-sm text-red-600">{submitError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

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
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 5551234567"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, Downtown"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type *</Label>
            <Select
              value={formData.clientType}
              onValueChange={(value) =>
                handleSelectChange("clientType", value as ClientCategory)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralSource">Referral Source</Label>
            <Input
              id="referralSource"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              placeholder="e.g., Facebook, Friend, Zalo"
              className={errors.referralSource ? "border-red-500" : ""}
            />
            {errors.referralSource && (
              <p className="text-red-500 text-xs">{errors.referralSource}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirement">Requirement</Label>
            <Textarea
              id="requirement"
              name="requirement"
              value={formData.requirement}
              onChange={(e) =>
                handleSelectChange("requirement", e.currentTarget.value)
              }
              rows={3}
              placeholder="Notes about needs (budget, location, type...)"
              className={errors.requirement ? "border-red-500" : ""}
            />
            {errors.requirement && (
              <p className="text-red-500 text-xs">{errors.requirement}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
