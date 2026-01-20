import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import type { Staff } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface StaffInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export function StaffInfoModal({
  isOpen,
  onClose,
  staff,
}: StaffInfoModalProps) {
  if (!staff) return null;

  const name = staff.full_name;
  const email = "email" in staff ? staff.email : null;
  const phone = "phone_number" in staff ? staff.phone_number : null;
  const username = "username" in staff ? staff.username : null;
  const assignedArea = staff.assigned_area;

  const statusLabel = staff.status === "working" ? "Working" : "Off duty";
  const statusClass =
    staff.status === "working"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Staff Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">S{staff.id}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Position & Area
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Position
                </p>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{staff.position}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Assigned Area
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{assignedArea ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{email ?? "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{phone ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account Information
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Username
                </p>
                <p className="text-sm text-gray-900">{username ?? "-"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <Badge className={statusClass}>{statusLabel}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
