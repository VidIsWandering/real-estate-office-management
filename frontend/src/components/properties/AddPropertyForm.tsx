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

interface AddPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
}

export interface PropertyFormData {
  name: string;
  type: string;
  status: string;
  price: string;
  agent: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
}

export function AddPropertyForm({
  isOpen,
  onClose,
  onSubmit,
}: AddPropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    type: "Apartment",
    status: "Available",
    price: "",
    agent: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
  });

  const [errors, setErrors] = useState<Partial<PropertyFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PropertyFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Property name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }
    if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    }
    if (!formData.agent.trim()) {
      newErrors.agent = "Agent is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        type: "Apartment",
        status: "Available",
        price: "",
        agent: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* Property Name */}
          <div>
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Modern Downtown Apartment"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, City, State"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price ($) *</Label>
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
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Agent */}
          <div>
            <Label htmlFor="agent">Assigned Agent *</Label>
            <Input
              id="agent"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              placeholder="e.g., Alice Chen"
              className={errors.agent ? "border-red-500" : ""}
            />
            {errors.agent && (
              <p className="text-red-500 text-sm mt-1">{errors.agent}</p>
            )}
          </div>

          {/* Bedrooms and Bathrooms Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="e.g., 2"
              />
            </div>
          </div>

          {/* Area */}
          <div>
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., 1500"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Property</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
