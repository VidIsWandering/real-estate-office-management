"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditStaffForm } from "@/components/staff/EditStaffForm";
import { StaffProfileDetail } from "@/components/staff/StaffProfileDetail";

interface Staff {
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

interface StaffFormData {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  position: string;
  assignedArea: string;
  status: "Active" | "Inactive";
}

// Mock data - In real app, this would come from API/database
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

export default function StaffDetailPage({
  params,
}: {
  params: { staffId: string };
}) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [staffData, setStaffData] = useState<Staff[]>(initialStaffData);

  const staff = staffData.find((s) => s.id === params.staffId);

  const handleStatusChange = (newStatus: "Active" | "Inactive") => {
    if (staff) {
      const updatedStaffData = staffData.map((s) =>
        s.id === staff.id ? { ...s, status: newStatus } : s,
      );
      setStaffData(updatedStaffData);
    }
  };

  const handleResetPassword = () => {
    if (staff) {
      const updatedStaffData = staffData.map((s) =>
        s.id === staff.id ? { ...s, password: s.phone } : s,
      );
      setStaffData(updatedStaffData);
      alert(`Password has been reset to phone number: ${staff.phone}`);
    }
  };

  const handleEditStaff = (data: StaffFormData) => {
    if (staff) {
      const updatedStaffData = staffData.map((s) =>
        s.id === staff.id ? { ...s, ...data } : s,
      );
      setStaffData(updatedStaffData);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteStaff = () => {
    if (
      staff &&
      window.confirm(`Are you sure you want to delete ${staff.name}?`)
    ) {
      router.push("/staff");
    }
  };

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
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={handleDeleteStaff}
        onStatusChange={handleStatusChange}
        onResetPassword={handleResetPassword}
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
