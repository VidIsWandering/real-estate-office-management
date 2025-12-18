"use client";

import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface StaffTableProps {
  staff: Staff[];
  onSelectStaff: (id: string) => void;
  selectedStaffId: string | null;
  onEditStaff: (id: string) => void;
  onResetPassword: (id: string) => void;
  onDeleteStaff: (id: string) => void;
}

export function StaffTable({
  staff,
  onSelectStaff,
  selectedStaffId,
  onEditStaff,
  onResetPassword,
  onDeleteStaff,
}: StaffTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const maskPassword = (password: string) => {
    return "*".repeat(password.length);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Staff ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Staff Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Username
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Password
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Position
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Assigned Area
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member, index) => (
            <tr
              key={member.id}
              onClick={() => onSelectStaff(member.id)}
              className={cn(
                "border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer",
                selectedStaffId === member.id && "bg-blue-100",
                index % 2 === 0 ? "bg-white" : "bg-gray-50",
              )}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {member.id}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">{member.name}</td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.username}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700 font-mono">
                {maskPassword(member.password)}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.phone}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.position}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.assignedArea}
              </td>
              <td className="px-4 py-4 text-sm">
                <Badge className={`${getStatusColor(member.status)}`}>
                  {member.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetPassword(member.id);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Reset password to phone number"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStaff(member.id);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Edit staff"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${member.name}?`,
                        )
                      ) {
                        onDeleteStaff(member.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
