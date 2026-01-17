"use client";

import { ArrowLeft, Mail, Phone, Briefcase, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AccountProfileFormProps {
  account: {
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: "Active" | "Inactive";
  };
  onEdit: () => void;
  onBack: () => void;
}

export function AccountProfileForm({
  account,
  onEdit,
  onBack,
}: AccountProfileFormProps) {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </button>
      </div>

      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <h3 className="text-xl font-bold text-white">{account.name}</h3>
        <p className="text-blue-100">@{account.username}</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-2">Contact</h4>
          <div className="space-y-2 text-sm">
            <p className="flex gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {account.email}
            </p>
            <p className="flex gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              {account.phone}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Role</h4>
          <p className="flex gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400" />
            {account.role}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Status</h4>
          <Badge
            className={
              account.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {account.status}
          </Badge>
        </div>

        <Button variant="outline" className="w-full" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Account
        </Button>
      </div>
    </div>
  );
}
