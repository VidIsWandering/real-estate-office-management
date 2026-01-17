import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface StaffProfileDetailProps {
  staff: Staff;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: "Active" | "Inactive") => void;
  onResetPassword: () => void;
}

export function StaffProfileDetail({
  staff,
  onEdit,
  onDelete,
  onStatusChange,
  onResetPassword,
}: StaffProfileDetailProps) {
  const [showPassword, setShowPassword] = useState(false);

  const maskPassword = (password: string) => {
    return "*".repeat(password.length);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{staff.name}</h3>
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
                  {staff.assignedArea}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                  {staff.email}
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
                  {staff.phone}
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

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Password
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-gray-900 flex-1">
                  {showPassword ? staff.password : maskPassword(staff.password)}
                </p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
          <Select
            value={staff.status}
            onValueChange={(value) =>
              onStatusChange(value as "Active" | "Inactive")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </SelectItem>
              <SelectItem value="Inactive">
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={onResetPassword}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Password
          </button>

          <button
            onClick={onEdit}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Information
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(`Are you sure you want to delete ${staff.name}?`)
              ) {
                onDelete();
              }
            }}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Staff
          </button>
        </div>
      </div>
    </div>
  );
}
