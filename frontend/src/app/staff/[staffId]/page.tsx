"use client";

import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditStaffForm } from "@/components/staff/EditStaffForm";
import { StaffProfileDetail } from "@/components/staff/StaffProfileDetail";
import type { UpdateStaffFormData } from "@/components/staff/types";
import { useAuth } from "@/lib/context/AuthProvider";
import {
  getStaffById,
  updateStaff,
  updateStaffPermissions,
  updateStaffStatus,
  type Staff,
  type StaffStatus,
} from "@/lib/api";

export default function StaffDetailPage({
  params,
}: {
  params: { staffId: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const canSeeAll = canManage;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStaffById(params.staffId);
      setStaff(response.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load staff");
      setStaff(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.staffId]);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  const handleStatusChange = (newStatus: StaffStatus) => {
    if (!canManage || !staff) return;
    void (async () => {
      await updateStaffStatus(staff.id, newStatus);
      await loadStaff();
    })();
  };

  const handleEditStaff = async (data: UpdateStaffFormData) => {
    if (!canManage || !staff) return;

    const roleChanged = data.role !== staff.position;

    await updateStaff(staff.id, {
      full_name: data.full_name,
      status: data.status,
      email: data.email.trim() ? data.email : undefined,
      phone_number: data.phone_number.trim() ? data.phone_number : undefined,
      address: data.address.trim() ? data.address : undefined,
      assigned_area: data.assigned_area.trim() ? data.assigned_area : undefined,
    });

    if (roleChanged) {
      await updateStaffPermissions(staff.id, { role: data.role });
    }
    setIsEditDialogOpen(false);
    await loadStaff();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-sm text-gray-600">
        Loading staff…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-sm text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push("/staff")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Staff List
        </button>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Staff Not Found
        </h1>
        {/* <p className="text-gray-600 mb-6">The staff member you're looking for doesn't exist.</p> */}
        <button
          onClick={() => router.push("/staff")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Staff List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/staff")}
        className="mb-4 md:mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Staff List
      </button>

      {/* Staff Detail Card */}
      <StaffProfileDetail
        staff={staff}
        canSeeAll={canSeeAll}
        canManage={canManage}
        onEdit={() => setIsEditDialogOpen(true)}
        onStatusChange={handleStatusChange}
      />

      {/* Edit Staff Dialog */}
      <EditStaffForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditStaff}
        initialData={staff}
      />
    </div>
  );
}
