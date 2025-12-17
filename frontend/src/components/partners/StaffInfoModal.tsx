import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Badge as BadgeIcon,
} from "lucide-react";
import { Staff } from "@/pages/Staff";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Staff Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {staff.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-500">{staff.id}</p>
            </div>
          </div>

          {/* Basic Information */}
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
                  <p className="text-sm text-gray-900">{staff.assignedArea}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
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
                  <p className="text-sm text-gray-900">{staff.email}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{staff.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account Information
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Username
                </p>
                <p className="text-sm text-gray-900">{staff.username}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <Badge
                  className={
                    staff.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {staff.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
