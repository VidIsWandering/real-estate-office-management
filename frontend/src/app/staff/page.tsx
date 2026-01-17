"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { StaffTable } from "@/components/staff/StaffTable";
import { AddStaffForm } from "@/components/staff/AddStaffForm";
import { StaffProfileDetail } from "@/components/staff/StaffProfileDetail";
import { EditStaffForm } from "@/components/staff/EditStaffForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface Staff {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  position: string;
  assignedArea: string;
  status: "Active" | "Inactive";
}

export interface StaffFormData {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  position: string;
  assignedArea: string;
  status: "Active" | "Inactive";
}

const initialStaffData: Staff[] = [
  {
    id: "S001",
    name: "Alice Chen",
    username: "alice.chen",
    password: "Pass123!",
    email: "alice.chen@realestate.com",
    phone: "5551234567",
    position: "Senior Agent",
    assignedArea: "Downtown District",
    status: "Active",
  },
  {
    id: "S002",
    name: "Bob Smith",
    username: "bob.smith",
    password: "SecurePass456",
    email: "bob.smith@realestate.com",
    phone: "5552345678",
    position: "Junior Agent",
    assignedArea: "Riverside District",
    status: "Active",
  },
  {
    id: "S003",
    name: "Carol Davis",
    username: "carol.davis",
    password: "ManagerPass789",
    email: "carol.davis@realestate.com",
    phone: "5553456789",
    position: "Sales Manager",
    assignedArea: "North Valley",
    status: "Active",
  },
  {
    id: "S004",
    name: "David Lee",
    username: "david.lee",
    password: "DavidPass123",
    email: "david.lee@realestate.com",
    phone: "5554567890",
    position: "Senior Agent",
    assignedArea: "Westside Area",
    status: "Active",
  },
  {
    id: "S005",
    name: "Emma Wilson",
    username: "emma.wilson",
    password: "EmmaSecure456",
    email: "emma.wilson@realestate.com",
    phone: "5555678901",
    position: "Senior Agent",
    assignedArea: "Downtown District",
    status: "Active",
  },
  {
    id: "S006",
    name: "Frank Brown",
    username: "frank.brown",
    password: "FrankPass789",
    email: "frank.brown@realestate.com",
    phone: "5556789012",
    position: "Junior Agent",
    assignedArea: "Riverside District",
    status: "Inactive",
  },
  {
    id: "S007",
    name: "Grace Martinez",
    username: "grace.martinez",
    password: "GracePass123",
    email: "grace.martinez@realestate.com",
    phone: "5557890123",
    position: "Property Manager",
    assignedArea: "North Valley",
    status: "Active",
  },
  {
    id: "S008",
    name: "Henry Johnson",
    username: "henry.johnson",
    password: "HenryPass456",
    email: "henry.johnson@realestate.com",
    phone: "5558901234",
    position: "Agent",
    assignedArea: "Eastside Zone",
    status: "Active",
  },
];

export default function Staff() {
  const [staffData, setStaffData] = useState<Staff[]>(initialStaffData);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isStaffDetailOpen, setIsStaffDetailOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);

  const selectedStaff = staffData.find((s) => s.id === selectedStaffId);

  const handleAddStaff = (data: StaffFormData) => {
    const newStaff: Staff = {
      ...data,
      id: `S${String(staffData.length + 1).padStart(3, "0")}`,
    };
    setStaffData([...staffData, newStaff]);
    setIsAddStaffDialogOpen(false);
  };

  const handleEditStaff = (data: StaffFormData) => {
    if (selectedStaff) {
      const updatedStaffData = staffData.map((s) =>
        s.id === selectedStaff.id ? { ...s, ...data } : s,
      );
      setStaffData(updatedStaffData);
      setIsEditStaffDialogOpen(false);
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffData(staffData.filter((s) => s.id !== staffId));
    if (selectedStaffId === staffId) {
      setSelectedStaffId(null);
    }
  };

  const handleResetPassword = (staffId: string) => {
    const staff = staffData.find((s) => s.id === staffId);
    if (staff) {
      const updatedStaffData = staffData.map((s) =>
        s.id === staffId ? { ...s, password: s.phone } : s,
      );
      setStaffData(updatedStaffData);
      if (selectedStaffId === staffId) {
        setSelectedStaffId(staffId);
      }
    }
  };

  const handleStatusChange = (
    staffId: string,
    newStatus: "Active" | "Inactive",
  ) => {
    const updatedStaffData = staffData.map((s) =>
      s.id === staffId ? { ...s, status: newStatus } : s,
    );
    setStaffData(updatedStaffData);
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
            <button
              onClick={() => setIsAddStaffDialogOpen(true)}
              className="px-4 md:px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm text-sm md:text-base"
            >
              <Plus className="w-4 md:w-5 h-4 md:h-5" />
              <span className="hidden sm:inline">Add New Staff</span>
              <span className="sm:hidden">Add Staff</span>
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <StaffTable
                staff={staffData}
                onSelectStaff={(staffId) => {
                  setSelectedStaffId(staffId);
                  setIsEditStaffDialogOpen(false);
                  setIsStaffDetailOpen(true);
                }}
                selectedStaffId={selectedStaffId}
                onEditStaff={(staffId) => {
                  setSelectedStaffId(staffId);
                  setIsStaffDetailOpen(false);
                  setIsEditStaffDialogOpen(true);
                }}
                onResetPassword={handleResetPassword}
                onDeleteStaff={handleDeleteStaff}
              />
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
                onEdit={() => {
                  setIsStaffDetailOpen(false);
                  setIsEditStaffDialogOpen(true);
                }}
                onDelete={() => handleDeleteStaff(selectedStaff.id)}
                onStatusChange={(newStatus: "Active" | "Inactive") =>
                  handleStatusChange(selectedStaff.id, newStatus)
                }
                onResetPassword={() => handleResetPassword(selectedStaff.id)}
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
