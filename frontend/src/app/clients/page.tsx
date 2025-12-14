"use client"

import { ClientHeader } from "@/components/clients/ClientHeader"
import { ClientTable } from "@/components/clients/ClientTable"
import { ClientStatsCard } from "@/components/clients/ClientStatsCard"
import {
  AddClientForm,
  ClientFormData,
} from "@/components/clients/AddClientForm";
import { useState } from "react";
const mockClients = [
  {
    id: "1",
    name: "John Wilson",
    email: "john.wilson@email.com",
    phone: "(555) 123-4567",
    type: "Buyer",
    status: "Active",
    properties: 2,
    joinDate: "2023-06-15",
    lastContact: "2024-01-08",
  },
  {
    id: "2",
    name: "Sarah Martinez",
    email: "sarah.martinez@email.com",
    phone: "(555) 234-5678",
    type: "Seller",
    status: "Active",
    properties: 3,
    joinDate: "2023-08-20",
    lastContact: "2024-01-07",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 345-6789",
    type: "Investor",
    status: "Active",
    properties: 5,
    joinDate: "2023-04-10",
    lastContact: "2024-01-06",
  },
  {
    id: "4",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "(555) 456-7890",
    type: "Buyer",
    status: "Lead",
    properties: 0,
    joinDate: "2024-01-05",
    lastContact: "2024-01-05",
  },
  {
    id: "5",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "(555) 567-8901",
    type: "Renter",
    status: "Active",
    properties: 1,
    joinDate: "2023-11-30",
    lastContact: "2024-01-08",
  },
  {
    id: "6",
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    phone: "(555) 678-9012",
    type: "Seller",
    status: "Inactive",
    properties: 2,
    joinDate: "2023-05-22",
    lastContact: "2023-12-15",
  },
];

export default function ClientsPage() {
    
    return (
        <div className="space-y-6">

            <ClientHeader />

            <div className="flex gap-6">


                <div className="flex-1">
                    <ClientTable />
                </div>


                <div className="w-80">
                    <ClientStatsCard />
                </div>
            </div>
            {/* <AddClientForm
                isOpen={isAddClientDialogOpen}
                onClose={() => setIsAddClientDialogOpen(false)}
                onSubmit={handleAddClient}
            />     */}
        </div>
    )
}
