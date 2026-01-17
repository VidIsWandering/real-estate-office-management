"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, User, Loader2, AlertCircle, Save, X } from "lucide-react";
import { getProfile, updateProfile, type UserProfile } from "@/lib/api";

export function AccountTab() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      setProfile(response.data);
      // Initialize form data
      setFormData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone_number: response.data.phone_number || "",
        address: response.data.address || "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form data
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-red-600 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error || "Profile not found"}</span>
        </div>
        <Button onClick={loadProfile} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Not available";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Not available";
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const positionLabel =
    {
      agent: "Agent",
      legal_officer: "Legal Officer",
      accountant: "Accountant",
      manager: "Manager",
      admin: "Administrator",
    }[profile.position] || profile.position;

  // Edit mode
  if (isEditing) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <p className="text-sm text-gray-500">
              Update your account information
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{profile.full_name}</h2>
          <p className="text-sm text-gray-500">{positionLabel}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p>{profile.email || "Not set"}</p>
        </div>
        <div>
          <p className="text-gray-500">Phone</p>
          <p>{profile.phone_number || "Not set"}</p>
        </div>
        <div>
          <p className="text-gray-500">Username</p>
          <p>{profile.username}</p>
        </div>
        <div>
          <p className="text-gray-500">Member Since</p>
          <p>{formatDate(profile.created_at)}</p>
        </div>
        {profile.assigned_area && (
          <div>
            <p className="text-gray-500">Assigned Area</p>
            <p>{profile.assigned_area}</p>
          </div>
        )}
        {profile.address && (
          <div>
            <p className="text-gray-500">Address</p>
            <p>{profile.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
