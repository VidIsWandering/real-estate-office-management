import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const mockOwners = [
  { id: "C001", name: "Nguyen Van A" },
  { id: "C002", name: "Tran Thi B" },
  { id: "C003", name: "Le Van C" },
  { id: "C004", name: "Pham Thi D" },
];

const mockStaff = [
  { id: "S001", name: "Alice Chen" },
  { id: "S002", name: "Bob Smith" },
  { id: "S003", name: "Carol Davis" },
  { id: "S004", name: "David Lee" },
];

interface AddPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
  title?: string;
  submitLabel?: string;
  initialData?: Partial<PropertyFormData>;
}

export interface PropertyFormData {
  // Property code (may be hidden)
  code: string;

  // Basic information
  name: string; // Title
  type: string; // Property type
  transactionType: "Sale" | "Rent" | "";
  address: string;
  price: string;

  // Details
  area: string;
  description: string;
  direction: string;
  media: string;

  // Management & legal
  ownerName: string;
  legalDocuments: string;
  status: string;
  agent: string; // Responsible staff
  legalNotes: string;

  // Legacy fields kept for compatibility with existing local mock data.
  bedrooms: string;
  bathrooms: string;
}

const defaultFormData: PropertyFormData = {
  code: "",
  name: "",
  type: "Apartment",
  transactionType: "",
  address: "",
  price: "",
  area: "",
  description: "",
  direction: "",
  media: "",
  ownerName: "",
  legalDocuments: "",
  status: "New",
  agent: "",
  legalNotes: "",
  bedrooms: "",
  bathrooms: "",
};

export function AddPropertyForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel,
  initialData,
}: AddPropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    ...defaultFormData,
    ...(initialData ?? {}),
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PropertyFormData, string>>
  >({});

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setFormData({
      ...defaultFormData,
      ...(initialData ?? {}),
    });
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PropertyFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Please enter a title";
    if (!formData.type.trim()) newErrors.type = "Please select a property type";
    if (!formData.transactionType)
      newErrors.transactionType = "Please select a transaction type";
    if (!formData.address.trim()) newErrors.address = "Please enter an address";

    if (!formData.price.trim()) newErrors.price = "Please enter a price";
    if (formData.price.trim() && isNaN(Number(formData.price)))
      newErrors.price = "Price must be a number";

    if (!formData.area.trim()) newErrors.area = "Please enter an area";
    if (formData.area.trim() && isNaN(Number(formData.area)))
      newErrors.area = "Area must be a number";

    if (!formData.ownerName.trim())
      newErrors.ownerName = "Please select an owner";

    if (!formData.status.trim())
      newErrors.status = "Please select a property status";

    if (!formData.agent.trim())
      newErrors.agent = "Please select a responsible staff member";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Property Profile"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Basic information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Basic information
            </h3>

            {/* Property code (may be hidden) */}
            <input type="hidden" name="code" value={formData.code} />

            <div className="space-y-2">
              <Label htmlFor="name">Title *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Modern downtown apartment"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Property type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-xs">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Transaction type *</Label>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="transaction-sale"
                    checked={formData.transactionType === "Sale"}
                    onCheckedChange={(checked) => {
                      handleSelectChange(
                        "transactionType",
                        checked === true ? "Sale" : "",
                      );
                    }}
                  />
                  <Label
                    htmlFor="transaction-sale"
                    className="font-normal cursor-pointer"
                  >
                    Sale
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="transaction-rent"
                    checked={formData.transactionType === "Rent"}
                    onCheckedChange={(checked) => {
                      handleSelectChange(
                        "transactionType",
                        checked === true ? "Rent" : "",
                      );
                    }}
                  />
                  <Label
                    htmlFor="transaction-rent"
                    className="font-normal cursor-pointer"
                  >
                    Rent
                  </Label>
                </div>
              </div>
              {errors.transactionType && (
                <p className="text-red-500 text-xs">{errors.transactionType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Nguyen Hue St, District 1, Ho Chi Minh City"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Details</h3>

            <div className="space-y-2">
              <Label htmlFor="area">Area (m²) *</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g., 120"
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && (
                <p className="text-red-500 text-xs">{errors.area}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description..."
              />
            </div>

            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) =>
                  handleSelectChange("direction", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="Northeast">Northeast</SelectItem>
                  <SelectItem value="Southeast">Southeast</SelectItem>
                  <SelectItem value="Northwest">Northwest</SelectItem>
                  <SelectItem value="Southwest">Southwest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Images/Videos</Label>
              <Textarea
                id="media"
                name="media"
                value={formData.media}
                onChange={handleChange}
                placeholder="Paste image/video links (one per line)"
              />
            </div>
          </div>

          {/* Management & legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Management & legal
            </h3>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner *</Label>
              <Select
                value={formData.ownerName}
                onValueChange={(value) =>
                  handleSelectChange("ownerName", value)
                }
              >
                <SelectTrigger
                  className={errors.ownerName ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {mockOwners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.name}>
                      {owner.id} - {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ownerName && (
                <p className="text-red-500 text-xs">{errors.ownerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalDocuments">Legal documents</Label>
              <Textarea
                id="legalDocuments"
                name="legalDocuments"
                value={formData.legalDocuments}
                onChange={handleChange}
                placeholder="Document notes / reference numbers / current state..."
              />
            </div>

            <div className="space-y-2">
              <Label>Property status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Pending legal review">
                    Pending legal review
                  </SelectItem>
                  <SelectItem value="Listed">Listed</SelectItem>
                  <SelectItem value="Negotiating">Negotiating</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Responsible staff *</Label>
              <Select
                value={formData.agent}
                onValueChange={(value) => handleSelectChange("agent", value)}
              >
                <SelectTrigger className={errors.agent ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {mockStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.name}>
                      {staff.id} - {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.agent && (
                <p className="text-red-500 text-xs">{errors.agent}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalNotes">Legal notes</Label>
              <Textarea
                id="legalNotes"
                name="legalNotes"
                value={formData.legalNotes}
                onChange={handleChange}
                placeholder="Add any legal-related notes..."
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {submitLabel ?? "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
