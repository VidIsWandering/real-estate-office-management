"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Phone, Home } from "lucide-react";

interface OfficeFormData {
  name: string;
  region: string;
  phone: string;
  address: string;
}

export function OfficeTab() {
  const [isEditing, setIsEditing] = useState(false);

  const [officeData, setOfficeData] = useState<OfficeFormData>({
    name: "RealEstate HQ",
    region: "Downtown District",
    phone: "(555) 123-4567",
    address: "100 Market St, City Center",
  });

  const [formData, setFormData] =
      useState<OfficeFormData>(officeData);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("UPDATE OFFICE:", formData);
    setOfficeData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(officeData);
    setIsEditing(false);
  };

  return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 max-w-3xl">
        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">
              Office Information
            </h2>
          </div>

          {!isEditing ? (
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
          ) : (
              <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
          )}
        </div>

        {/* ===== VIEW MODE ===== */}
        {!isEditing && (
            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoItem
                  icon={<Home className="w-4 h-4" />}
                  label="Office Name"
                  value={officeData.name}
              />
              <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Region"
                  value={officeData.region}
              />
              <InfoItem
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={officeData.phone}
              />
              <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={officeData.address}
              />
            </div>
        )}

        {/* ===== EDIT MODE ===== */}
        {isEditing && (
            <div className="grid grid-cols-2 gap-6 text-sm">
              <FormItem
                  label="Office Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
              />
              <FormItem
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
              />
              <FormItem
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
              />
              <FormItem
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
              />
            </div>
        )}
      </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

function InfoItem({
                    icon,
                    label,
                    value,
                  }: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
      <div className="flex gap-3 items-start">
        <div className="mt-1 text-gray-400">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900">
            {value}
          </p>
        </div>
      </div>
  );
}

function FormItem({
                    label,
                    name,
                    value,
                    onChange,
                  }: {
  label: string;
  name: string;
  value: string;
  onChange: (
      e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
      <div>
        <Label>{label}</Label>
        <Input
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1"
        />
      </div>
  );
}
