"use client";

import { useState, useEffect } from "react";
import { ContractsHeader } from "@/components/contracts/ContractsHeader";
import { ContractsFilter, ContractsFilterValues } from "@/components/contracts/ContractsFilter";
import { ContractsTable } from "@/components/contracts/ContractsTable";
import { ContractsStats } from "@/components/contracts/ContractsStats";
import { ContractForm } from "@/components/contracts/ContractForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getContracts, Contract, ContractType, ContractStatus } from "@/lib/api/contract";

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    pending_signature: "Awaiting signature",
    signed: "Signed",
    notarized: "Notarized",
    finalized: "Liquidated",
    cancelled: "Cancelled"
  };
  return map[status] || status;
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    deposit: "Deposit agreement",
    purchase: "Sale & purchase",
    lease: "Lease agreement"
  };
  return map[type] || type;
}

function getStatusColor(status: string): "gray" | "yellow" | "blue" | "green" | "purple" | "red" {
  const map: Record<string, "gray" | "yellow" | "blue" | "green" | "purple" | "red"> = {
    draft: "gray",
    pending_signature: "yellow",
    signed: "blue",
    notarized: "green",
    finalized: "purple",
    cancelled: "red"
  };
  return map[status] || "gray";
}

function getTypeColor(type: string): "deposit" | "sale" | "lease" {
  const map: Record<string, "deposit" | "sale" | "lease"> = {
    deposit: "deposit",
    purchase: "sale",
    lease: "lease"
  };
  return map[type] || "deposit";
}

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B VND`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M VND`;
  }
  return `${value.toLocaleString()} VND`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

interface UIContract {
  id: string;
  transactionId: string;
  contractType: string;
  typeColor: "deposit" | "sale" | "lease";
  partyA: string;
  partyB: string;
  totalValue: string;
  depositAmount: string;
  signDate: string;
  effectiveDate: string;
  legalStaff: string;
  status: string;
  statusColor: "gray" | "yellow" | "blue" | "green" | "purple" | "red";
  hasFile: boolean;
}

export default function ContractsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contracts, setContracts] = useState<UIContract[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<ContractsFilterValues>({
    search: "",
    type: "all",
    status: "all"
  });

  const loadContracts = async () => {
    try {
      setLoading(true);
      const params: {
        page: number;
        limit: number;
        type?: ContractType;
        status?: ContractStatus;
      } = { page: 1, limit: 50 };
      
      if (filters.type !== "all") {
        params.type = filters.type as ContractType;
      }
      if (filters.status !== "all") {
        params.status = filters.status as ContractStatus;
      }

      const res = await getContracts(params);
      
      if (res.success && res.data) {
        let items = res.data.map((c: Contract) => ({
          id: `HD${String(c.id).padStart(3, "0")}`,
          transactionId: `GD${String(c.transaction_id).padStart(3, "0")}`,
          contractType: getTypeLabel(c.type),
          typeColor: getTypeColor(c.type),
          partyA: `Party ${c.party_a}`,
          partyB: `Party ${c.party_b}`,
          totalValue: formatCurrency(c.total_value),
          depositAmount: formatCurrency(c.deposit_amount),
          signDate: formatDate(c.signed_date),
          effectiveDate: formatDate(c.effective_date),
          legalStaff: `Legal: Staff ${c.staff_id}`,
          status: getStatusLabel(c.status),
          statusColor: getStatusColor(c.status),
          hasFile: false
        }));
        
        // Client-side search
        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          items = items.filter((c: UIContract) => 
            c.id.toLowerCase().includes(searchLower) ||
            c.transactionId.toLowerCase().includes(searchLower) ||
            c.partyA.toLowerCase().includes(searchLower) ||
            c.partyB.toLowerCase().includes(searchLower)
          );
        }

        setContracts(items);
      }
    } catch (err) {
      console.error("Load contracts failed", err);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [filters]);

  return (
    <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
      <ContractsHeader />

      <ContractsFilter 
        onCreate={() => setShowCreateForm(true)}
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <ContractsTable contracts={contracts} />
        </div>

        <div className="w-80">
          <ContractsStats />
        </div>
      </div>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="w-[95vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Contract</DialogTitle>
          </DialogHeader>
          <ContractForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
