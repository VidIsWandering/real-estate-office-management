"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Staff, StaffStatus } from "@/lib/api";

interface StaffTableProps {
  staff: Staff[];
  onSelectStaff: (id: string) => void;
  selectedStaffId: string | null;
  canSeeAll: boolean;
  canManage: boolean;
  onEditStaff?: (id: string) => void;
  onStatusChange?: (id: string, status: StaffStatus) => void;
}

export function StaffTable({
  staff,
  onSelectStaff,
  selectedStaffId,
  canSeeAll,
  canManage,
  onEditStaff,
  onStatusChange,
}: StaffTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800";
      case "off_duty":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStatus = (status: string) =>
    status === "working"
      ? "Working"
      : status === "off_duty"
        ? "Off duty"
        : status;

  const hasFullFields = (
    member: Staff,
  ): member is Staff & {
    username: string;
    email: string | null;
    phone_number: string | null;
  } => "username" in member;

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
              Position
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Assigned Area
            </th>
            {canSeeAll && (
              <>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
              </>
            )}
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            {canManage && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {staff.map((member, index) => (
            <tr
              key={member.id}
              onClick={() => onSelectStaff(String(member.id))}
              className={cn(
                "border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer",
                selectedStaffId === String(member.id) && "bg-blue-100",
                index % 2 === 0 ? "bg-white" : "bg-gray-50",
              )}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-900">
                {member.id}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {member.full_name}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.position}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {member.assigned_area || "-"}
              </td>
              {canSeeAll && (
                <>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {hasFullFields(member) ? member.username : "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {hasFullFields(member) ? member.email || "-" : "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {hasFullFields(member) ? member.phone_number || "-" : "-"}
                  </td>
                </>
              )}
              <td className="px-4 py-4 text-sm">
                {canManage && onStatusChange ? (
                  <Select
                    value={member.status}
                    onValueChange={(value) =>
                      onStatusChange(String(member.id), value as StaffStatus)
                    }
                  >
                    <SelectTrigger
                      className="w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="working">
                        <Badge className="bg-green-100 text-green-800">
                          Working
                        </Badge>
                      </SelectItem>
                      <SelectItem value="off_duty">
                        <Badge className="bg-gray-100 text-gray-800">
                          Off duty
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`${getStatusColor(member.status)}`}>
                    {renderStatus(member.status)}
                  </Badge>
                )}
              </td>
              {canManage && (
                <td className="px-4 py-4">
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStaff?.(String(member.id));
                      }}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                      title="Edit staff"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
