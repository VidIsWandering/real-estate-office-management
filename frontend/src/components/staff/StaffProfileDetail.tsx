import { Mail, Phone, MapPin, Briefcase, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Staff, StaffFull, StaffStatus } from "@/lib/api";

interface StaffProfileDetailProps {
  staff: Staff;
  canSeeAll: boolean;
  canManage: boolean;
  onEdit?: () => void;
  onStatusChange?: (status: StaffStatus) => void;
}

export function StaffProfileDetail({
  staff,
  canSeeAll,
  canManage,
  onEdit,
  onStatusChange,
}: StaffProfileDetailProps) {
  const isFull = (s: Staff): s is StaffFull => "username" in s;
  const renderStatus = (status: string) =>
    status === "working"
      ? "Working"
      : status === "off_duty"
        ? "Off duty"
        : status;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {staff.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{staff.full_name}</h3>
            <p className="text-blue-100">{staff.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Basic Information
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Position
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {staff.position}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Assigned Area
              </p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {staff.assigned_area || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {canSeeAll && isFull(staff) && (
          <>
            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {staff.email || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {staff.phone_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Account Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Username
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {staff.username}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Status */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
          {canManage ? (
            <Select
              value={staff.status}
              onValueChange={(value) => onStatusChange?.(value as StaffStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">
                  <Badge className="bg-green-100 text-green-800">Working</Badge>
                </SelectItem>
                <SelectItem value="off_duty">
                  <Badge className="bg-gray-100 text-gray-800">Off duty</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge
              className={
                staff.status === "working"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {renderStatus(staff.status)}
            </Badge>
          )}
        </div>

        {canManage && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => onEdit?.()}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Information
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
