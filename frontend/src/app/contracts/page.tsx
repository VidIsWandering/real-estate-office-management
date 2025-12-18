"use client";

import { useState } from "react";
import { ContractsHeader } from "@/components/contracts/ContractsHeader";
import { ContractsFilter } from "@/components/contracts/ContractsFilter";
import { ContractsTable } from "@/components/contracts/ContractsTable";
import { ContractsStats } from "@/components/contracts/ContractsStats";
import { ContractForm } from "@/components/contracts/ContractForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContractsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex-1 space-y-4 md:space-y-6 min-w-0">
      <ContractsHeader />

      <ContractsFilter onCreate={() => setShowCreateForm(true)} />

      <div className="flex gap-6">
        <div className="flex-1">
          <ContractsTable />
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
