"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AccountTab } from "@/components/settings/account/AccountTab";
import { AccountEditForm } from "@/components/settings/account/AccountEditForm";
import { AccountProfileForm } from "@/components/settings/account/AccountProfileForm";
import { getProfile, type UserProfile } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthProvider";

export default function AccountPage() {
  const router = useRouter();
  const mode = useSearchParams().get("mode");

  const { updateMyProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "profile" && mode !== "edit") return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProfile();
        setProfile(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mode]);

  const account = useMemo(() => {
    if (!profile) return null;
    return {
      name: profile.full_name || profile.username,
      username: profile.username,
      email: profile.email || "Not set",
      phone: profile.phone_number || "Not set",
      role: profile.position,
      status:
        profile.status === "inactive"
          ? ("Inactive" as const)
          : ("Active" as const),
    };
  }, [profile]);

  if (mode === "edit") {
    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error || !profile) {
      return (
        <div className="text-sm text-red-600">
          {error || "Profile not found"}
        </div>
      );
    }

    return (
      <AccountEditForm
        initialData={{
          full_name: profile.full_name || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          address: profile.address || "",
        }}
        onSubmit={async (data) => {
          await updateMyProfile({
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            address: data.address,
          });
          router.push("/settings/account?mode=profile");
        }}
        onCancel={() => router.push("/settings")}
      />
    );
  }

  if (mode === "profile") {
    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error || !account) {
      return (
        <div className="text-sm text-red-600">
          {error || "Profile not found"}
        </div>
      );
    }

    return (
      <AccountProfileForm
        account={account}
        onEdit={() => router.push("/settings/account?mode=edit")}
        onBack={() => router.push("/settings")}
      />
    );
  }

  return <AccountTab />;
}
