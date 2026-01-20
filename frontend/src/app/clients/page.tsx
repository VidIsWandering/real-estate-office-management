"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ClientTable } from "@/components/clients/ClientTable";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { ClientProfileDetail } from "@/components/clients/ClientProfileDetail";
import { EditClientForm } from "@/components/clients/EditClientForm";
import { StaffInfoModal } from "@/components/clients/StaffInfoModal";
import type { Client, ClientType, Staff } from "@/lib/api";
import {
  createClient,
  deleteClient,
  getClientsList,
  getStaffList,
  updateClient,
} from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  ClientCategory,
  ClientFormData,
  ClientItem,
  ClientStatus,
} from "@/components/clients/types";

const toUiClientType = (type: ClientType): ClientCategory =>
  type === "seller" || type === "landlord" ? "owner" : "customer";

const toApiClientType = (clientType: ClientCategory): ClientType =>
  clientType === "owner" ? "seller" : "buyer";

const toUiClientStatus = (client: Client): ClientStatus =>
  client.is_active === false ? "Inactive" : "Active";

const toClientItem = (
  client: Client,
  staffName?: string | null,
): ClientItem => ({
  id: String(client.id),
  code: `CLT-${String(client.id).padStart(3, "0")}`,
  name: client.full_name,
  email: client.email ?? "",
  phone: client.phone_number ?? "",
  address: client.address ?? "",
  clientType: toUiClientType(client.type),
  assignedStaff: staffName ?? client.staff_name ?? "",
  status: toUiClientStatus(client),
  joinDate: (client.created_at ?? new Date().toISOString()).split("T")[0] ?? "",
  referralSource: client.referral_src ?? "",
  requirement: client.requirement ?? "",
});

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStaffInfoModalOpen, setIsStaffInfoModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const staffByName = useMemo(() => {
    const map = new Map<string, Staff>();
    for (const staff of staffData) map.set(staff.full_name, staff);
    return map;
  }, [staffData]);


  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [clientsRes, staffRes] = await Promise.all([
        getClientsList({ page: 1, limit: 100 }),
        getStaffList({ page: 1, limit: 100 }),
      ]);

      const localStaffNameById = new Map<number, string>();
      for (const staff of staffRes.data) {
        localStaffNameById.set(staff.id, staff.full_name);
      }

      setStaffData(staffRes.data);
      setClients(
        clientsRes.data.map((c) =>
          toClientItem(
            c,
            c.staff_id ? localStaffNameById.get(c.staff_id) : null,
          ),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddClient = async (data: ClientFormData) => {
    await createClient({
      full_name: data.name.trim(),
      email: data.email.trim(),
      phone_number: data.phone.trim(),
      address: data.address.trim(),
      type: toApiClientType(data.clientType),
      referral_src: data.referralSource.trim(),
      requirement: data.requirement.trim(),
    });

    setIsAddClientDialogOpen(false);
    await loadData();
  };

  const handleEditClient = async (data: ClientFormData) => {
    if (!selectedClient) return;

    await updateClient(selectedClient.id, {
      full_name: data.name.trim(),
      email: data.email.trim() ? data.email : undefined,
      phone_number: data.phone.trim() ? data.phone : undefined,
      address: data.address.trim() ? data.address : undefined,
      type: toApiClientType(data.clientType),
      referral_src: data.referralSource.trim() ? data.referralSource : undefined,
      requirement: data.requirement.trim() ? data.requirement : undefined,
    });

    setIsEditClientDialogOpen(false);
    await loadData();
  };

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient(clientId);
    if (selectedClientId === clientId) {
      setSelectedClientId(null);
    }
    await loadData();
  };

  const handleStaffNameClick = (staffName: string) => {
    const staff = staffByName.get(staffName);
    if (staff) {
      setSelectedStaff(staff);
      setIsStaffInfoModalOpen(true);
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clients (owners and customers) and their information.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
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

          <button
            onClick={() => setIsAddClientDialogOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add New Client
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ClientTable
            clients={filteredClients}
            onSelectClient={setSelectedClientId}
            selectedClientId={selectedClientId}
            onDeleteClient={handleDeleteClient}
            onStaffNameClick={handleStaffNameClick}
          />
        </div>
      </div>

      <Sheet
        open={selectedClientId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedClientId(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Client details</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-6 overflow-y-auto">
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
            {!isLoading && selectedClient && (
              <ClientProfileDetail
                client={selectedClient}
                onEdit={() => setIsEditClientDialogOpen(true)}
                onDelete={() => handleDeleteClient(selectedClient.id)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AddClientForm
        isOpen={isAddClientDialogOpen}
        onClose={() => setIsAddClientDialogOpen(false)}
        onSubmit={handleAddClient}
      />

      {selectedClient && (
        <EditClientForm
          isOpen={isEditClientDialogOpen}
          onClose={() => setIsEditClientDialogOpen(false)}
          onSubmit={handleEditClient}
          initialData={selectedClient}
        />
      )}

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
