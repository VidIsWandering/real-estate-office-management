"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AccountFormData {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface Props {
  initialData: AccountFormData;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
}

const editableFields: Array<{
  key: keyof AccountFormData;
  label: string;
  disabled?: boolean;
  type?: string;
}> = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone_number", label: "Phone Number" },
  { key: "address", label: "Address" },
];

export function AccountEditForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<AccountFormData>(initialData);

  const handleChange = (key: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Edit Account</h2>

      <div className="space-y-4">
        {editableFields.map(({ key, label, disabled, type }) => (
          <div key={key}>
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type={type ?? "text"}
              value={formData[key]}
              disabled={disabled}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => onSubmit(formData)}>Save</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
