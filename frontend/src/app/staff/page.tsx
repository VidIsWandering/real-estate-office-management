"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StaffTable } from "@/components/staff/StaffTable";
import { AddStaffForm } from "@/components/staff/AddStaffForm";
import { StaffProfileDetail } from "@/components/staff/StaffProfileDetail";
import { EditStaffForm } from "@/components/staff/EditStaffForm";
import type {
  CreateStaffFormData,
  UpdateStaffFormData,
} from "@/components/staff/types";
import { useAuth } from "@/lib/context/AuthProvider";
import {
  createStaff,
  getStaffList,
  updateStaff,
  updateStaffPermissions,
  updateStaffStatus,
  type Staff,
  type StaffStatus,
} from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Staff() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const canSeeAll = canManage;

  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedStaff = useMemo(
    () => staffData.find((s) => String(s.id) === selectedStaffId),
    [staffData, selectedStaffId],
  );

  const loadStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStaffList({ page: 1, limit: 50 });
      setStaffData(response.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  const handleAddStaff = async (data: CreateStaffFormData) => {
    if (!canManage) return;

    await createStaff({
      username: data.username,
      password: data.password,
      full_name: data.full_name,
      role: data.role,
      status: data.status,
      email: data.email.trim() ? data.email : undefined,
      phone_number: data.phone_number.trim() ? data.phone_number : undefined,
      address: data.address.trim() ? data.address : undefined,
      assigned_area: data.assigned_area.trim() ? data.assigned_area : undefined,
    });

    setIsAddStaffDialogOpen(false);
    await loadStaff();
  };

  const handleEditStaff = async (data: UpdateStaffFormData) => {
    if (!canManage || !selectedStaffId) return;

    const currentRole = selectedStaff?.position;
    const roleChanged = !!currentRole && data.role !== currentRole;

    await updateStaff(selectedStaffId, {
      full_name: data.full_name,
      status: data.status,
      email: data.email.trim() ? data.email : undefined,
      phone_number: data.phone_number.trim() ? data.phone_number : undefined,
      address: data.address.trim() ? data.address : undefined,
      assigned_area: data.assigned_area.trim() ? data.assigned_area : undefined,
    });

    if (roleChanged) {
      await updateStaffPermissions(selectedStaffId, { role: data.role });
    }

    setIsEditStaffDialogOpen(false);
    await loadStaff();
  };

  const handleStatusChange = (staffId: string, newStatus: StaffStatus) => {
    if (!canManage) return;
    void (async () => {
      await updateStaffStatus(staffId, newStatus);
      await loadStaff();
    })();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {/* Page Title */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Staff Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage your staff members and their assigned areas.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end mb-4 md:mb-6">
            {canManage && (
              <button
                onClick={() => setIsAddStaffDialogOpen(true)}
                className="px-4 md:px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm text-sm md:text-base"
              >
                <Plus className="w-4 md:w-5 h-4 md:h-5" />
                <span className="hidden sm:inline">Add New Staff</span>
                <span className="sm:hidden">Add Staff</span>
              </button>
            )}
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6 text-sm text-gray-600">Loading staff…</div>
              ) : error ? (
                <div className="p-6 text-sm text-red-600">{error}</div>
              ) : (
                <StaffTable
                  staff={staffData}
                  canSeeAll={canSeeAll}
                  canManage={canManage}
                  onSelectStaff={(staffId) => {
                    setSelectedStaffId(staffId);
                    setIsEditStaffDialogOpen(false);
                    setIsStaffDetailOpen(true);
                  }}
                  selectedStaffId={selectedStaffId}
                  onStatusChange={handleStatusChange}
                  onEditStaff={(staffId) => {
                    if (!canManage) return;
                    setSelectedStaffId(staffId);
                    setIsStaffDetailOpen(false);
                    setIsEditStaffDialogOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Slide-in Detail Drawer */}
      <Sheet
        open={isStaffDetailOpen}
        onOpenChange={(open) => {
          setIsStaffDetailOpen(open);
          if (!open) setSelectedStaffId(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Staff details</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-6 overflow-y-auto">
            {selectedStaff && (
              <StaffProfileDetail
                staff={selectedStaff}
                canSeeAll={canSeeAll}
                canManage={canManage}
                onEdit={() => {
                  if (!canManage) return;
                  setIsStaffDetailOpen(false);
                  setIsEditStaffDialogOpen(true);
                }}
                onStatusChange={(newStatus: StaffStatus) =>
                  handleStatusChange(String(selectedStaff.id), newStatus)
                }
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Staff Dialog */}
      <AddStaffForm
        isOpen={isAddStaffDialogOpen}
        onClose={() => setIsAddStaffDialogOpen(false)}
        onSubmit={handleAddStaff}
      />

      {/* Edit Staff Dialog */}
      {selectedStaff && (
        <EditStaffForm
          isOpen={isEditStaffDialogOpen}
          onClose={() => setIsEditStaffDialogOpen(false)}
          onSubmit={handleEditStaff}
          initialData={selectedStaff}
        />
      )}
    </>
  );
}
