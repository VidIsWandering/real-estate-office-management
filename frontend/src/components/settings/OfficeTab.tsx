"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  MapPin,
  Phone,
  Home,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getAllSystemConfigs, updateSystemConfig } from "@/lib/api";

interface OfficeFormData {
  name: string;
  region: string;
  phone: string;
  address: string;
}

export function OfficeTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [officeData, setOfficeData] = useState<OfficeFormData>({
    name: "",
    region: "",
    phone: "",
    address: "",
  });

  const [formData, setFormData] = useState<OfficeFormData>(officeData);

  // Load office configs on mount
  useEffect(() => {
    loadOfficeConfigs();
  }, []);

  const loadOfficeConfigs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const response = await getAllSystemConfigs();

      // Extract office-related configs
      const configs = response.data;
      const data: OfficeFormData = {
        name:
          (configs.find((c) => c.key === "office_name")?.value as string) || "",
        region:
          (configs.find((c) => c.key === "office_region")?.value as string) ||
          "",
        phone:
          (configs.find((c) => c.key === "office_phone")?.value as string) ||
          "",
        address:
          (configs.find((c) => c.key === "office_address")?.value as string) ||
          "",
      };

      setOfficeData(data);
      setFormData(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load office information"
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Update each config
      await Promise.all([
        updateSystemConfig("office_name", formData.name),
        updateSystemConfig("office_region", formData.region),
        updateSystemConfig("office_phone", formData.phone),
        updateSystemConfig("office_address", formData.address),
      ]);

      // Reload data from backend to verify save (silent to avoid loading flash)
      await loadOfficeConfigs(true);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save office information"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(officeData);
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 max-w-3xl">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Office Information</h2>
        </div>

        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Office information saved successfully</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

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
        <p className="text-sm font-medium text-gray-900">{value}</p>
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} className="mt-1" />
    </div>
  );
}
