"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { PartnerTable } from "@/components/partners/PartnerTable";
import { AddPartnerForm } from "@/components/partners/AddPartnerForm";
import { PartnerProfileDetail } from "@/components/partners/PartnerProfileDetail";
import { EditPartnerForm } from "@/components/partners/EditPartnerForm";
import { StaffInfoModal } from "@/components/partners/StaffInfoModal";
import { Staff } from "@/app/staff/page";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export interface Partner {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  partnerType: "owner" | "customer";
  assignedStaff: string;
  status: "Active" | "Inactive";
  joinDate: string;
}

export interface PartnerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  partnerType: "owner" | "customer";
  assignedStaff: string;
  status: "Active" | "Inactive";
}

const staffMembers = [
  "Alice Chen",
  "Bob Smith",
  "Carol Davis",
  "David Lee",
  "Emma Wilson",
  "Frank Brown",
  "Grace Martinez",
  "Henry Johnson",
];

const staffDatabase: Record<string, Staff> = {
  "Alice Chen": {
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
  "Bob Smith": {
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
  "Carol Davis": {
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
  "David Lee": {
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
  "Emma Wilson": {
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
  "Frank Brown": {
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
  "Grace Martinez": {
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
  "Henry Johnson": {
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
};

const initialPartnerData: Partner[] = [
  {
    id: "P001",
    code: "PTN-001",
    name: "John Wilson",
    email: "john.wilson@email.com",
    phone: "5551234567",
    address: "123 Main St, Downtown District",
    partnerType: "owner",
    assignedStaff: "Alice Chen",
    status: "Active",
    joinDate: "2023-06-15",
  },
  {
    id: "P002",
    code: "PTN-002",
    name: "Sarah Martinez",
    email: "sarah.martinez@email.com",
    phone: "5552345678",
    address: "456 Oak Ave, Riverside District",
    partnerType: "customer",
    assignedStaff: "Bob Smith",
    status: "Active",
    joinDate: "2023-08-20",
  },
  {
    id: "P003",
    code: "PTN-003",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "5553456789",
    address: "789 Pine Rd, North Valley",
    partnerType: "owner",
    assignedStaff: "Carol Davis",
    status: "Active",
    joinDate: "2023-04-10",
  },
  {
    id: "P004",
    code: "PTN-004",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "5554567890",
    address: "321 Elm St, Westside Area",
    partnerType: "customer",
    assignedStaff: "David Lee",
    status: "Active",
    joinDate: "2024-01-05",
  },
  {
    id: "P005",
    code: "PTN-005",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "5555678901",
    address: "654 Cedar Ln, Eastside Zone",
    partnerType: "owner",
    assignedStaff: "Emma Wilson",
    status: "Active",
    joinDate: "2023-11-30",
  },
  {
    id: "P006",
    code: "PTN-006",
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    phone: "5556789012",
    address: "987 Birch Blvd, Suburban Region",
    partnerType: "customer",
    assignedStaff: "Frank Brown",
    status: "Inactive",
    joinDate: "2023-05-22",
  },
];

export default function Partners() {
  const [partnerData, setPartnerData] = useState<Partner[]>(initialPartnerData);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null,
  );
  const [isAddPartnerDialogOpen, setIsAddPartnerDialogOpen] = useState(false);
  const [isEditPartnerDialogOpen, setIsEditPartnerDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStaffInfoModalOpen, setIsStaffInfoModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const selectedPartner = partnerData.find((p) => p.id === selectedPartnerId);

  const filteredPartners = partnerData.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddPartner = (data: PartnerFormData) => {
    const newPartner: Partner = {
      ...data,
      id: `P${String(partnerData.length + 1).padStart(3, "0")}`,
      code: `PTN-${String(partnerData.length + 1).padStart(3, "0")}`,
      joinDate: new Date().toISOString().split("T")[0],
    };
    setPartnerData([...partnerData, newPartner]);
    setIsAddPartnerDialogOpen(false);
  };

  const handleEditPartner = (data: PartnerFormData) => {
    if (selectedPartner) {
      const updatedPartnerData = partnerData.map((p) =>
        p.id === selectedPartner.id ? { ...p, ...data } : p,
      );
      setPartnerData(updatedPartnerData);
      setIsEditPartnerDialogOpen(false);
    }
  };

  const handleDeletePartner = (partnerId: string) => {
    setPartnerData(partnerData.filter((p) => p.id !== partnerId));
    if (selectedPartnerId === partnerId) {
      setSelectedPartnerId(null);
    }
  };

  const handleStaffNameClick = (staffName: string) => {
    const staff = staffDatabase[staffName];
    if (staff) {
      setSelectedStaff(staff);
      setIsStaffInfoModalOpen(true);
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your client (owners and customers) and their information.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Add Partner Button */}
          <button
            onClick={() => setIsAddPartnerDialogOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add New Client
          </button>
        </div>

        {/* Partners Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <PartnerTable
            partners={filteredPartners}
            onSelectPartner={setSelectedPartnerId}
            selectedPartnerId={selectedPartnerId}
            onDeletePartner={handleDeletePartner}
            onStaffNameClick={handleStaffNameClick}
          />
        </div>
      </div>

      {/* Right Slide-in Detail Drawer */}
      <Sheet
        open={selectedPartnerId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPartnerId(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Client details</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-6 overflow-y-auto">
            {selectedPartner && (
              <PartnerProfileDetail
                partner={selectedPartner}
                onEdit={() => setIsEditPartnerDialogOpen(true)}
                onDelete={() => handleDeletePartner(selectedPartner.id)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Partner Dialog */}
      <AddPartnerForm
        isOpen={isAddPartnerDialogOpen}
        onClose={() => setIsAddPartnerDialogOpen(false)}
        onSubmit={handleAddPartner}
        staffMembers={staffMembers}
      />

      {/* Edit Partner Dialog */}
      {selectedPartner && (
        <EditPartnerForm
          isOpen={isEditPartnerDialogOpen}
          onClose={() => setIsEditPartnerDialogOpen(false)}
          onSubmit={handleEditPartner}
          initialData={selectedPartner}
          staffMembers={staffMembers}
        />
      )}

      {/* Staff Info Modal */}
      <StaffInfoModal
        isOpen={isStaffInfoModalOpen}
        onClose={() => {
          setIsStaffInfoModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
      />
    </div>
  );
}
